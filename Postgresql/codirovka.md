 **клиентская кодировка (client_encoding) установлена в WIN1251**, а должна быть UTF8. Именно из-за этого русские символы сохраняются и отображаются некорректно.

## 🔧 **Как исправить client_encoding**

### **Вариант 1: Временно для текущей сессии**

```sql
-- Установить кодировку для текущего подключения
SET client_encoding TO 'UTF8';

-- Проверить
SHOW client_encoding;
```

### **Вариант 2: Постоянно для всех подключений**

```sql
-- Изменить параметр в конфигурации
ALTER SYSTEM SET client_encoding TO 'UTF8';

-- Перезагрузить конфигурацию
SELECT pg_reload_conf();
```

### **Вариант 3: В Python при подключении**

```python
import psycopg2

# Способ 1: при создании подключения
conn = psycopg2.connect(
    host="localhost",
    database="flask_db",
    user="postgres",
    password="your_password",
    options="-c client_encoding=UTF8"
)

# Способ 2: после создания подключения
conn = psycopg2.connect(
    host="localhost",
    database="flask_db",
    user="postgres",
    password="your_password"
)
conn.set_client_encoding('UTF8')
```

### **Вариант 4: Через переменные окружения**

```bash
# Windows (CMD)
set PGCLIENTENCODING=UTF8
psql -U postgres -d flask_db

# Windows (PowerShell)
$env:PGCLIENTENCODING="UTF8"
psql -U postgres -d flask_db

# Linux/macOS
export PGCLIENTENCODING=UTF8
psql -U postgres -d flask_db
```

## 📝 **Обновленный app.py с правильной кодировкой**

```python
import psycopg2
from psycopg2 import sql
from flask import Flask, request, jsonify, render_template_string
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False  # для правильного отображения русских символов в JSON

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'flask_db')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')

def get_db_connection():
    """Подключение к БД с принудительной UTF-8 кодировкой"""
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    # Принудительно устанавливаем UTF-8 для клиента
    conn.set_client_encoding('UTF8')
    
    # Проверка кодировки
    cur = conn.cursor()
    cur.execute("SHOW client_encoding;")
    encoding = cur.fetchone()[0]
    print(f"📡 Client encoding: {encoding}")
    cur.close()
    
    return conn

@app.route('/')
def index():
    """Главная страница"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Создаем таблицу, если её нет
        cur.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                last_name VARCHAR(100),
                first_name VARCHAR(100),
                group_name VARCHAR(50)
            );
        """)
        conn.commit()
        
        # Получаем список студентов
        cur.execute("SELECT * FROM students ORDER BY last_name;")
        students = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Формируем HTML
        html = """
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Список студентов</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                input, button { padding: 8px; margin: 5px; }
            </style>
        </head>
        <body>
            <h1>📚 Список студентов</h1>
            
            <h2>➕ Добавить студента</h2>
            <form action="/add" method="post">
                <input type="text" name="last_name" placeholder="Фамилия" required>
                <input type="text" name="first_name" placeholder="Имя" required>
                <input type="text" name="group_name" placeholder="Группа">
                <button type="submit">Добавить</button>
            </form>
            
            <h2>📋 Список студентов</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Группа</th>
                </tr>
        """
        
        for student in students:
            html += f"""
                <tr>
                    <td>{student[0]}</td>
                    <td>{student[1] or ''}</td>
                    <td>{student[2] or ''}</td>
                    <td>{student[3] or ''}</td>
                </tr>
            """
        
        html += """
            </table>
        </body>
        </html>
        """
        
        return html
        
    except Exception as e:
        return f"❌ Ошибка: {str(e)}"

@app.route('/add', methods=['POST'])
def add_student():
    """Добавление студента"""
    try:
        last_name = request.form.get('last_name', '').strip()
        first_name = request.form.get('first_name', '').strip()
        group_name = request.form.get('group_name', '').strip()
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO students (last_name, first_name, group_name)
            VALUES (%s, %s, %s);
        """, (last_name, first_name, group_name))
        
        conn.commit()
        cur.close()
        conn.close()
        
        print(f"✅ Добавлен: {last_name} {first_name}")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
    
    return index()

@app.route('/fix-encoding')
def fix_encoding():
    """Исправление кодировки в базе данных"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cur = conn.cursor()
        
        # 1. Устанавливаем клиентскую кодировку
        cur.execute("SET client_encoding TO 'UTF8';")
        
        # 2. Проверяем и изменяем кодировку базы данных
        cur.execute("""
            UPDATE pg_database 
            SET encoding = pg_char_to_encoding('UTF8')
            WHERE datname = current_database();
        """)
        
        # 3. Перезагружаем конфигурацию
        cur.execute("SELECT pg_reload_conf();")
        
        cur.close()
        conn.close()
        
        return """
        ✅ Кодировка исправлена!
        <br><br>
        <a href="/">Вернуться на главную</a>
        """
        
    except Exception as e:
        return f"❌ Ошибка: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## 📝 **Скрипт для исправления существующих данных**

Если в базе уже есть данные с неправильной кодировкой, создайте файл `fix_data.py`:

```python
import psycopg2
import sys

def fix_existing_data():
    """Исправление существующих данных"""
    
    # Подключение
    conn = psycopg2.connect(
        host="localhost",
        database="flask_db",
        user="postgres",
        password="your_password"
    )
    
    # Устанавливаем правильную кодировку
    conn.set_client_encoding('UTF8')
    
    cur = conn.cursor()
    
    # Проверяем текущие данные
    cur.execute("SELECT * FROM students;")
    rows = cur.fetchall()
    
    print("📋 Текущие данные:")
    for row in rows:
        print(f"ID: {row[0]}, Фамилия: {row[1]}, Имя: {row[2]}, Группа: {row[3]}")
    
    # Если данные битые, их нужно пересохранить
    # (это сложный процесс, проще удалить и добавить заново)
    print("\n⚠️  Если данные отображаются неправильно, лучше:")
    print("1. Удалить таблицу: DROP TABLE students;")
    print("2. Пересоздать с правильной кодировкой")
    print("3. Добавить данные заново")
    
    cur.close()
    conn.close()

def recreate_table():
    """Пересоздание таблицы с правильной кодировкой"""
    
    conn = psycopg2.connect(
        host="localhost",
        database="flask_db",
        user="postgres",
        password="your_password"
    )
    conn.set_client_encoding('UTF8')
    
    cur = conn.cursor()
    
    # Удаляем старую таблицу
    cur.execute("DROP TABLE IF EXISTS students;")
    
    # Создаем новую
    cur.execute("""
        CREATE TABLE students (
            id SERIAL PRIMARY KEY,
            last_name VARCHAR(100),
            first_name VARCHAR(100),
            group_name VARCHAR(50)
        );
    """)
    
    # Добавляем тестовые данные
    test_data = [
        ('Иванов', 'Иван', 'ИС-201'),
        ('Петрова', 'Анна', 'ИС-202'),
        ('Сидоров', 'Петр', 'ИС-203'),
        ('Ёлкин', 'Пётр', 'ИС-204'),
        ('Фёдорова', 'Екатерина', 'ИС-205')
    ]
    
    for last, first, group in test_data:
        cur.execute(
            "INSERT INTO students (last_name, first_name, group_name) VALUES (%s, %s, %s);",
            (last, first, group)
        )
    
    conn.commit()
    
    # Проверка
    cur.execute("SELECT * FROM students ORDER BY last_name;")
    rows = cur.fetchall()
    
    print("✅ Таблица пересоздана. Данные:")
    for row in rows:
        print(f"  {row[1]} {row[2]} - {row[3]}")
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    print("1. Проверка данных")
    fix_existing_data()
    
    print("\n2. Пересоздание таблицы")
    recreate_table()
```

## 🚀 **Быстрое решение через командную строку**

```bash
# 1. Подключиться к PostgreSQL
psql -U postgres -d flask_db

# 2. Выполнить внутри psql:
# SET client_encoding TO 'UTF8';
# ALTER SYSTEM SET client_encoding TO 'UTF8';
# SELECT pg_reload_conf();
# \q

# 3. Проверить
psql -U postgres -d flask_db -c "SHOW client_encoding;"
```

## ✅ **Проверка после исправления**

```sql
-- Должно показывать UTF8
SHOW client_encoding;

-- Тест с русскими символами
SELECT 'Привет мир' as test;

-- Если нужно, создайте тестовую таблицу
CREATE TABLE test_encoding (text_col TEXT);
INSERT INTO test_encoding VALUES ('Тест Ёжик');
SELECT * FROM test_encoding;
DROP TABLE test_encoding;
```

## 📊 **Сравнение до и после**

| Параметр | До | После |
|----------|-----|-------|
| server_encoding | UTF8 | UTF8 |
| client_encoding | WIN1251 | UTF8 |
| Русские символы | Кракозябры | Нормально |

После выполнения этих шагов русские символы будут корректно отображаться в PostgreSQL! 🎉
