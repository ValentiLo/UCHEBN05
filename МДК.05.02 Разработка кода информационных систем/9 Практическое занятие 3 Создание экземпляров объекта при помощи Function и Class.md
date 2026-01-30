# Практическое занятие №3  
**«Создание экземпляров объекта при помощи Function и Class в Python»**

---

## **Метаданные занятия**
- **Дисциплина:** Программирование на Python / ООП
- **Тема:** Сравнение функционального и объектно-ориентированного подхода к созданию объектов
- **Формат:** Практическая работа с кодом
- **Продолжительность:** 90-120 минут
- **Цель:** Освоить различные способы создания и работы с объектами в Python
- **Результат:** Реализация одного и того же функционала разными способами

---

## **Теоретическая часть (20 минут)**

### **1. Что такое объект в Python?**
- **Объект** — это экземпляр данных, который содержит:
  - **Состояние** (атрибуты/поля)
  - **Поведение** (методы/функции)

### **2. Подходы к созданию объектов:**

| Подход | Суть | Когда использовать |
|--------|------|-------------------|
| **Функциональный** | Используем обычные функции и словари | Простые структуры данных, небольшие проекты |
| **Классовый (ООП)** | Используем классы и методы | Сложные системы, повторное использование кода, наследование |
| **Dataclasses** | Автоматическая генерация методов | Структуры данных с автоматическим `__init__`, `__repr__` и т.д. |
| **NamedTuple** | Неизменяемые структуры | Только для чтения, простые контейнеры данных |

---

## **Практическая часть (70 минут)**

### **Задача: Реализовать систему управления пользователями**

Требования:
- Хранение данных пользователя (id, имя, email, возраст)
- Методы: представление, обновление email, проверка совершеннолетия
- Создание нескольких пользователей и работа с ними

---

### **Часть 1: Функциональный подход**

```python
# ===================== ФУНКЦИОНАЛЬНЫЙ ПОДХОД =====================

def create_user(user_id, name, email, age):
    """Создает пользователя как словарь"""
    return {
        'id': user_id,
        'name': name,
        'email': email,
        'age': age,
        'created_at': '2024-01-01',  # можно добавить datetime.now()
        'is_active': True
    }

def user_to_str(user):
    """Возвращает строковое представление пользователя"""
    return f"User(id={user['id']}, name='{user['name']}', email='{user['email']}', age={user['age']})"

def update_user_email(user, new_email):
    """Обновляет email пользователя"""
    if '@' in new_email:
        user['email'] = new_email
        return True
    return False

def is_adult(user):
    """Проверяет, совершеннолетний ли пользователь"""
    return user['age'] >= 18

def user_workflow():
    """Демонстрация работы с пользователями (функциональный подход)"""
    print("=" * 60)
    print("ФУНКЦИОНАЛЬНЫЙ ПОДХОД")
    print("=" * 60)
    
    # Создаем пользователей
    user1 = create_user(1, "Анна", "anna@example.com", 25)
    user2 = create_user(2, "Борис", "boris@example.com", 17)
    
    # Выводим информацию
    print("Созданные пользователи:")
    print(f"1. {user_to_str(user1)}")
    print(f"2. {user_to_str(user2)}")
    
    # Работа с методами
    print("\nМетоды работы с пользователями:")
    print(f"Анна совершеннолетняя? {is_adult(user1)}")
    print(f"Борис совершеннолетний? {is_adult(user2)}")
    
    # Обновление email
    print("\nОбновление email:")
    if update_user_email(user1, "anna.new@company.com"):
        print(f"Email Анны обновлен: {user1['email']}")
    
    # Попытка обновить на некорректный email
    if not update_user_email(user2, "некорректный-email"):
        print("Некорректный email для Бориса!")
    
    print("=" * 60)
    
# Запуск демонстрации
user_workflow()
```

---

### **Часть 2: Классовый подход (ООП)**

```python
# ===================== КЛАССОВЫЙ ПОДХОД (ООП) =====================

class User:
    """Класс для представления пользователя"""
    
    # Атрибут класса (общий для всех экземпляров)
    user_count = 0
    
    def __init__(self, name, email, age):
        """Конструктор класса (инициализация экземпляра)"""
        User.user_count += 1
        
        # Атрибуты экземпляра (уникальные для каждого объекта)
        self.id = User.user_count
        self.name = name
        self.email = email
        self.age = age
        self.created_at = '2024-01-01'
        self.is_active = True
        
        print(f"Создан пользователь: {self.name} (ID: {self.id})")
    
    def __str__(self):
        """Строковое представление объекта (для print)"""
        return f"User(id={self.id}, name='{self.name}', email='{self.email}', age={self.age})"
    
    def __repr__(self):
        """Представление объекта для разработчика"""
        return f"User(name='{self.name}', email='{self.email}', age={self.age})"
    
    def update_email(self, new_email):
        """Обновляет email пользователя"""
        if '@' in new_email:
            self.email = new_email
            return True
        return False
    
    def is_adult(self):
        """Проверяет, совершеннолетний ли пользователь"""
        return self.age >= 18
    
    def get_info(self):
        """Возвращает подробную информацию о пользователе"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'age': self.age,
            'is_adult': self.is_adult(),
            'is_active': self.is_active
        }
    
    # Метод класса (работает с классом, а не с экземпляром)
    @classmethod
    def get_user_count(cls):
        """Возвращает количество созданных пользователей"""
        return cls.user_count
    
    # Статический метод (не требует доступа к классу или экземпляру)
    @staticmethod
    def validate_email(email):
        """Валидация email"""
        return '@' in email and '.' in email.split('@')[-1]
    
    # Свойство (property) - выглядит как атрибут, но вычисляется
    @property
    def birth_year(self):
        """Год рождения (пример вычисляемого свойства)"""
        from datetime import datetime
        current_year = datetime.now().year
        return current_year - self.age

def oop_workflow():
    """Демонстрация работы с пользователями (ООП подход)"""
    print("\n" + "=" * 60)
    print("ОБЪЕКТНО-ОРИЕНТИРОВАННЫЙ ПОДХОД")
    print("=" * 60)
    
    # Создаем экземпляры класса
    user1 = User("Анна", "anna@example.com", 25)
    user2 = User("Борис", "boris@example.com", 17)
    user3 = User("Виктор", "victor@example.com", 30)
    
    # Выводим информацию
    print("\nСозданные пользователи:")
    print(f"1. {user1}")  # Используется __str__
    print(f"2. {user2}")
    print(f"3. {user3}")
    
    # Работа с методами экземпляра
    print("\nМетоды экземпляра:")
    print(f"Анна совершеннолетняя? {user1.is_adult()}")
    print(f"Борис совершеннолетний? {user2.is_adult()}")
    print(f"Подробная информация о Викторе: {user3.get_info()}")
    
    # Обновление email
    print("\nОбновление email:")
    if user1.update_email("anna.new@company.com"):
        print(f"Email Анны обновлен: {user1.email}")
    
    # Использование свойства
    print(f"\nАнна предположительно родилась в {user1.birth_year} году")
    
    # Использование статического метода
    print(f"\nВалидация email 'test@test.com': {User.validate_email('test@test.com')}")
    print(f"Валидация email 'invalid': {User.validate_email('invalid')}")
    
    # Использование метода класса
    print(f"\nВсего создано пользователей: {User.get_user_count()}")
    
    print("=" * 60)

# Запуск демонстрации
oop_workflow()
```

---

### **Часть 3: Сравнительный анализ**

```python
# ===================== СРАВНИТЕЛЬНЫЙ АНАЛИЗ =====================

def comparison_demo():
    """Сравнение функционального и ООП подходов"""
    print("\n" + "=" * 60)
    print("СРАВНИТЕЛЬНЫЙ АНАЛИЗ ПОДХОДОВ")
    print("=" * 60)
    
    # Функциональный подход
    print("\n1. ФУНКЦИОНАЛЬНЫЙ ПОДХОД:")
    print("   + Простота для небольших задач")
    print("   + Минимальный оверхед")
    print("   - Сложно поддерживать при росте проекта")
    print("   - Нет инкапсуляции")
    print("   - Дублирование кода")
    
    # ООП подход
    print("\n2. ООП ПОДХОД:")
    print("   + Инкапсуляция (данные + методы вместе)")
    print("   + Наследование (повторное использование кода)")
    print("   + Полиморфизм (разное поведение у разных объектов)")
    print("   - Больше кода для простых задач")
    print("   - Сложнее для начинающих")
    
    # Практическое сравнение
    print("\n3. ПРАКТИЧЕСКОЕ СРАВНЕНИЕ:")
    
    # Создание объектов
    print("   Создание объектов:")
    print("   - Функциональный: user = create_user(1, 'Name', 'email', 25)")
    print("   - ООП: user = User('Name', 'email', 25)")
    
    # Вызов методов
    print("\n   Вызов методов:")
    print("   - Функциональный: is_adult(user)")
    print("   - ООП: user.is_adult()")
    
    # Изменение состояния
    print("\n   Изменение состояния:")
    print("   - Функциональный: user['age'] = 26")
    print("   - ООП: user.age = 26")
    
    print("\n" + "=" * 60)

comparison_demo()
```

---

### **Часть 4: Практическое задание для студентов**

**Задача:** Реализовать систему управления библиотекой книг

#### **Требования:**
1. Книга должна иметь:
   - ID (уникальный идентификатор)
   - Название
   - Автор
   - Год издания
   - Статус (доступна/выдана)
   - Читателя (если выдана)

2. Методы:
   - Взять книгу (пометить как выданную, указать читателя)
   - Вернуть книгу (пометить как доступную)
   - Получить информацию о книге
   - Проверить, является ли книга антикварной (> 50 лет)

#### **Вариант 1: Функциональный подход**

```python
# TODO: Реализуйте функциональный подход
# Шаблон для начала:
def create_book(book_id, title, author, year):
    pass

def borrow_book(book, reader_name):
    pass

def return_book(book):
    pass

def is_antique(book):
    pass
```

#### **Вариант 2: Классовый подход**

```python
# TODO: Реализуйте классовый подход
# Шаблон для начала:
class Book:
    def __init__(self, title, author, year):
        pass
    
    def borrow(self, reader_name):
        pass
    
    def return_book(self):
        pass
    
    def is_antique(self):
        pass
```

---

### **Часть 5: Дополнительные материалы**

#### **1. Dataclasses (Python 3.7+)**

```python
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

@dataclass
class Product:
    """Пример использования dataclass"""
    name: str
    price: float
    quantity: int = 0
    created_at: datetime = field(default_factory=datetime.now)
    description: Optional[str] = None
    
    def total_value(self):
        """Общая стоимость товара на складе"""
        return self.price * self.quantity

# Автоматически генерируются:
# - __init__
# - __repr__
# - __eq__

product = Product("Ноутбук", 50000.0, 5)
print(product)  # Автоматическое строковое представление
```

#### **2. NamedTuple**

```python
from typing import NamedTuple

class Point(NamedTuple):
    """Неизменяемая структура данных"""
    x: float
    y: float
    
    def distance_to_origin(self):
        """Расстояние до начала координат"""
        return (self.x ** 2 + self.y ** 2) ** 0.5

p = Point(3, 4)
print(p.distance_to_origin())  # 5.0
# p.x = 10  # Ошибка! NamedTuple неизменяемый
```

#### **3. Enum для статусов**

```python
from enum import Enum

class BookStatus(Enum):
    """Перечисление статусов книги"""
    AVAILABLE = "доступна"
    BORROWED = "выдана"
    RESERVED = "зарезервирована"
    LOST = "утрачена"

class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author
        self.status = BookStatus.AVAILABLE
    
    def borrow(self):
        if self.status == BookStatus.AVAILABLE:
            self.status = BookStatus.BORROWED
            return True
        return False
```

---

## **Критерии оценки**

| Критерий | Баллы | Описание |
|----------|-------|----------|
| **Корректность** | 0-3 | Код работает без ошибок, выполняет все требования |
| **Стиль кода** | 0-2 | Соблюдение PEP 8, понятные имена переменных |
| **ООП принципы** | 0-2 | Правильное использование классов, методов, свойств |
| **Документация** | 0-1 | Наличие комментариев и docstrings |
| **Сравнение** | 0-2 | Понимание различий между подходами |

**Максимум: 10 баллов**

---

## **Домашнее задание**

1. **Реализовать оба подхода** для системы управления сотрудниками компании:
   - Хранение: имя, должность, зарплата, дата приема
   - Методы: повышение зарплаты, изменение должности, расчет стажа

2. **Сравнить производительность:** написать тест, который создает 10000 объектов каждым способом и измеряет время

3. **Исследование:** изучить и описать различия между:
   - `__str__` и `__repr__`
   - `@classmethod` и `@staticmethod`
   - Обычные методы и свойства (`@property`)

---

## **Полезные команды для отладки**

```python
# Проверка типа объекта
print(type(user))  # <class '__main__.User'>

# Проверка атрибутов объекта
print(dir(user))  # Список всех атрибутов и методов

# Проверка является ли объект экземпляром класса
print(isinstance(user, User))  # True

# Получение словаря атрибутов объекта
print(vars(user))  # или user.__dict__

# Документация класса/функции
print(help(User))
print(User.__doc__)
```

---

**Финальный месседж:**  
*«Выбор между функциональным и объектно-ориентированным подходом зависит от конкретной задачи. Функциональный подход проще для небольших скриптов, ООП — мощнее для больших систем. Важно уметь применять оба подхода в зависимости от контекста. Помните: «Есть много способов сделать это» — это про Python!»*
