При сохранении данных в PostgreSQL проблема с кодировкой может возникать на нескольких уровнях. Вот полное решение для правильной работы с русскими символами.

## 🔧 **Проверка кодировки PostgreSQL**

### **1. Проверьте текущую кодировку базы данных**

Подключитесь к PostgreSQL и выполните:

```sql
-- Проверка кодировки базы данных
SHOW server_encoding;
SHOW client_encoding;
\l -- список всех баз с их кодировками
```

**Ожидаемый результат:** `UTF8`

### **2. Если кодировка не UTF-8, создайте базу заново**

```sql
-- Создание базы с правильной кодировкой
CREATE DATABASE your_database 
    ENCODING 'UTF8' 
    LC_COLLATE 'ru_RU.UTF-8' 
    LC_CTYPE 'ru_RU.UTF-8'
    TEMPLATE template0;

-- Или проще (Windows)
CREATE DATABASE your_database 
    ENCODING 'UTF8' 
    TEMPLATE template0;
```

## 📝 **Правильный app.py с поддержкой русских символов**

```python
import psycopg2
from psycopg2 import sql
from flask import Flask, request, jsonify, render_template_string
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Настройки подключения
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'students_db')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')

def get_db_connection():
    """Подключение к БД с правильной кодировкой"""
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    # Установка клиентской кодировки
    conn.set_client_encoding('UTF8')
    return conn

def init_db():
    """Инициализация базы данных"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Создание таблицы с поддержкой Unicode
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                last_name VARCHAR(100) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                group_name VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Проверка кодировки таблицы
        cursor.execute("""
            SELECT pg_encoding_to_char(encoding) 
            FROM pg_database 
            WHERE datname = current_database();
        """)
        encoding = cursor.fetchone()[0]
        print(f"✅ Кодировка базы данных: {encoding}")
        
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Таблица students создана/проверена")
        
    except Exception as e:
        print(f"❌ Ошибка инициализации БД: {e}")

# HTML шаблон с правильной кодировкой
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Список студентов</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        input, button { padding: 8px; margin: 5px; }
        .form-group { margin-bottom: 10px; }
    </style>
</head>
<body>
    <h1>📚 Список студентов</h1>
    
    <h2>➕ Добавить студента</h2>
    <form action="/add" method="post">
        <div class="form-group">
            <input type="text" name="last_name" placeholder="Фамилия" required>
        </div>
        <div class="form-group">
            <input type="text" name="first_name" placeholder="Имя" required>
        </div>
        <div class="form-group">
            <input type="text" name="group_name" placeholder="Группа">
        </div>
        <button type="submit">Добавить</button>
    </form>
    
    <h2>📋 Список студентов</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Группа</th>
                <th>Дата добавления</th>
            </tr>
        </thead>
        <tbody>
            {% for student in students %}
            <tr>
                <td>{{ student[0] }}</td>
                <td>{{ student[1] }}</td>
                <td>{{ student[2] }}</td>
                <td>{{ student[3] or '-' }}</td>
                <td>{{ student[4] }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</body>
</html>
"""

@app.route('/')
def index():
    """Главная страница со списком студентов"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Получение всех студентов
        cursor.execute("SELECT * FROM students ORDER BY last_name, first_name;")
        students = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return render_template_string(HTML_TEMPLATE, students=students)
    
    except Exception as e:
        return f"❌ Ошибка: {str(e)}"

@app.route('/add', methods=['POST'])
def add_student():
    """Добавление нового студента"""
    try:
        last_name = request.form.get('last_name', '').strip()
        first_name = request.form.get('first_name', '').strip()
        group_name = request.form.get('group_name', '').strip() or None
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Вставка с правильной обработкой Unicode
        cursor.execute("""
            INSERT INTO students (last_name, first_name, group_name)
            VALUES (%s, %s, %s)
            RETURNING id;
        """, (last_name, first_name, group_name))
        
        student_id = cursor.fetchone()[0]
        conn.commit()
        
        cursor.close()
        conn.close()
        
        print(f"✅ Добавлен студент: {last_name} {first_name} (ID: {student_id})")
        
    except Exception as e:
        print(f"❌ Ошибка добавления: {e}")
    
    return index()

@app.route('/api/students', methods=['GET'])
def get_students_api():
    """API для получения списка студентов в JSON"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM students ORDER BY last_name;")
        students = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Преобразование в JSON с правильной кодировкой
        result = []
        for s in students:
            result.append({
                'id': s[0],
                'last_name': s[1],
                'first_name': s[2],
                'group': s[3],
                'created_at': str(s[4])
            })
        
        # Убеждаемся, что JSON в UTF-8
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/search')
def search_students():
    """Поиск студентов по фамилии или имени"""
    query = request.args.get('q', '').strip()
    
    if not query:
        return index()
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Поиск с поддержкой Unicode
        cursor.execute("""
            SELECT * FROM students 
            WHERE last_name ILIKE %s 
               OR first_name ILIKE %s
            ORDER BY last_name, first_name;
        """, (f'%{query}%', f'%{query}%'))
        
        students = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        result = "<h2>🔍 Результаты поиска:</h2>"
        if students:
            result += "<ul>"
            for s in students:
                result += f"<li>{s[1]} {s[2]} ({s[3] or 'группа не указана'})</li>"
            result += "</ul>"
        else:
            result += "<p>❌ Ничего не найдено</p>"
        
        result += '<p><a href="/">← Вернуться к списку</a></p>'
        
        return result
    
    except Exception as e:
        return f"❌ Ошибка: {str(e)}"

if __name__ == '__main__':
    # Инициализация БД
    init_db()
    
    # Запуск сервера
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## 📋 **Файл .env**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=students_db
DB_USER=postgres
DB_PASSWORD=your_password
```

## 🚀 **Скрипт для инициализации базы данных**

Создайте файл `init_db.sql`:

```sql
-- Создание базы с UTF-8
DROP DATABASE IF EXISTS students_db;
CREATE DATABASE students_db 
    ENCODING 'UTF8' 
    TEMPLATE template0;

\c students_db;

-- Создание таблицы
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    group_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление тестовых данных
INSERT INTO students (last_name, first_name, group_name) VALUES
    ('Иванов', 'Иван', 'ИС-201'),
    ('Петрова', 'Анна', 'ИС-202'),
    ('Сидоров', 'Петр', 'ИС-201'),
    ('Смирнова', 'Елена', 'ИС-203');

-- Проверка
SELECT * FROM students ORDER BY last_name;
```

Выполните из командной строки:
```bash
# Windows
psql -U postgres -f init_db.sql

# Linux/macOS
sudo -u postgres psql -f init_db.sql
```

## ✅ **Проверка работы с русскими символами**

### **1. Через командную строку PostgreSQL:**
```sql
-- Подключение к базе
\c students_db

-- Проверка кодировки
SHOW client_encoding;

-- Вставка русских символов
INSERT INTO students (last_name, first_name, group_name) 
VALUES ('Ёлкин', 'Пётр', 'ИС-204');

-- Проверка отображения
SELECT * FROM students WHERE last_name = 'Ёлкин';
```

### **2. Через Python:**
```python
# test_encoding.py
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="students_db",
    user="postgres",
    password="your_password"
)

cursor = conn.cursor()

# Тест с русскими символами
test_data = [
    ('Фёдоров', 'Фёдор', 'ИС-205'),
    ('Щербакова', 'Екатерина', 'ИС-206'),
    ('Юрьев', 'Дмитрий', 'ИС-207')
]

for last, first, group in test_data:
    cursor.execute(
        "INSERT INTO students (last_name, first_name, group_name) VALUES (%s, %s, %s)",
        (last, first, group)
    )

conn.commit()

# Проверка
cursor.execute("SELECT * FROM students ORDER BY last_name;")
for row in cursor.fetchall():
    print(f"{row[1]} {row[2]} - {row[3]}")

cursor.close()
conn.close()
```

## 🔍 **Диагностика проблем с кодировкой**

```python
# diagnostic.py
import psycopg2
import sys

def check_encoding():
    """Проверка всех уровней кодировки"""
    
    conn = psycopg2.connect(
        host="localhost",
        database="students_db",
        user="postgres",
        password="your_password"
    )
    
    cursor = conn.cursor()
    
    # 1. Кодировка сервера
    cursor.execute("SHOW server_encoding;")
    server_enc = cursor.fetchone()[0]
    print(f"🖥️  Сервер: {server_enc}")
    
    # 2. Кодировка клиента
    cursor.execute("SHOW client_encoding;")
    client_enc = cursor.fetchone()[0]
    print(f"📱 Клиент: {client_enc}")
    
    # 3. Кодировка базы данных
    cursor.execute("""
        SELECT pg_encoding_to_char(encoding) 
        FROM pg_database 
        WHERE datname = current_database();
    """)
    db_enc = cursor.fetchone()[0]
    print(f"🗄️  База данных: {db_enc}")
    
    # 4. Кодировка таблицы
    cursor.execute("""
        SELECT pg_encoding_to_char(encoding) 
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'students';
    """)
    table_enc = cursor.fetchone()
    if table_enc:
        print(f"📋 Таблица: {table_enc[0]}")
    
    # 5. Тест с русскими символами
    test_string = "Тест Ёжик"
    cursor.execute("SELECT %s::text;", (test_string,))
    result = cursor.fetchone()[0]
    print(f"✅ Тест: '{test_string}' -> '{result}'")
    
    if test_string != result:
        print("❌ ПРОБЛЕМА: символы искажаются!")
    else:
        print("✅ OK: символы сохраняются корректно")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    check_encoding()
```

Запустите:
```bash
python diagnostic.py
```

## 🎯 **Краткий чек-лист**

```
[ ] База данных создана с ENCODING 'UTF8'
[ ] client_encoding = 'UTF8'
[ ] server_encoding = 'UTF8'
[ ] В HTML указан <meta charset="UTF-8">
[ ] Flask обрабатывает UTF-8 (app.config['JSON_AS_ASCII'] = False)
[ ] При вставке используются параметризованные запросы
[ ] psycopg2 настроен на UTF-8
```

После выполнения всех шагов русские символы должны корректно сохраняться и отображаться в PostgreSQL! 🚀
