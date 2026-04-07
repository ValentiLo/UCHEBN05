**PEP 8** (Python Enhancement Proposal 8) — это руководство по написанию чистого и читаемого кода на Python. Вот основные правила:

---

## **1. Отступы (Indentation)**

```python
# ✅ Хорошо: 4 пробела
def hello():
    print("Hello")
    if True:
        print("World")

# ❌ Плохо: табуляция или 2 пробела
def hello():
  print("Hello")
```

---

## **2. Длина строки (Line Length)**

```python
# ✅ Хорошо: максимум 79 символов
long_variable_name = "Это строка, которая помещается в 79 символов"

# ❌ Плохо: слишком длинная строка
very_long_line = "Эта строка слишком длинная и её сложно читать, особенно если она превышает 79 символов, что затрудняет просмотр кода"
```

---

## **3. Пустые строки (Blank Lines)**

```python
# ✅ Хорошо: 2 пустые строки между функциями/классами
class MyClass:
    pass


def function_one():
    pass


def function_two():
    pass
```

---

## **4. Пробелы вокруг операторов (Whitespace)**

```python
# ✅ Хорошо
x = 10
y = x + 5
result = (x + y) * 2

# ❌ Плохо
x=10
y=x+5
result=(x+y)*2
```

```python
# ✅ Хорошо: после запятых
my_list = [1, 2, 3, 4]
my_dict = {'a': 1, 'b': 2}

# ❌ Плохо: пробелы перед запятыми
my_list = [1 ,2 ,3 ,4]
```

---

## **5. Именование (Naming Conventions)**

| Тип | Стиль | Пример |
|-----|-------|--------|
| Переменные | snake_case | `user_name`, `total_count` |
| Функции | snake_case | `get_user()`, `calculate_sum()` |
| Классы | PascalCase | `UserProfile`, `BankAccount` |
| Константы | UPPER_SNAKE_CASE | `MAX_SIZE`, `DEFAULT_COLOR` |
| Приватные атрибуты | _snake_case | `_internal_value` |

```python
# ✅ Хорошо
MAX_USERS = 100

class UserAccount:
    def __init__(self, name):
        self.name = name
        self._balance = 0  # приватный атрибут
    
    def get_balance(self):
        return self._balance

# ❌ Плохо
maxusers = 100
class useraccount:
    pass
```

---

## **6. Импорты (Imports)**

```python
# ✅ Хорошо: каждый импорт на отдельной строке
import os
import sys
from datetime import datetime

# ✅ Хорошо: порядок импортов
# 1. Стандартные библиотеки
import json
import random

# 2. Сторонние библиотеки
import requests
from flask import Flask

# 3. Локальные модули
from myproject import helpers

# ❌ Плохо: несколько импортов в одной строке
import os, sys, json
```

---

## **7. Кавычки (Quotes)**

```python
# ✅ Можно и то, и другое, главное — единообразие
name = "Иван"      # двойные
text = 'Привет'    # одинарные

# ✅ Для docstring всегда тройные двойные
def my_func():
    """Это docstring с тройными двойными кавычками"""
    pass
```

---

## **8. Пробелы в скобках**

```python
# ✅ Хорошо: нет пробелов внутри скобок
my_list = [1, 2, 3]
my_dict = {'key': 'value'}
my_tuple = (1, 2, 3)
function(arg1, arg2)

# ❌ Плохо: пробелы внутри скобок
my_list = [ 1, 2, 3 ]
my_dict = { 'key': 'value' }
function( arg1, arg2 )
```

---

## **9. Двоеточия и точки с запятой**

```python
# ✅ Хорошо
if x == 10:
    print("x is 10")

# ❌ Плохо: точка с запятой не нужна
if x == 10:
    print("x is 10");

# ❌ Плохо: несколько операторов в одной строке
x = 1; y = 2; z = 3
```

---

## **10. Комментарии и docstring**

```python
# ✅ Хорошо: комментарий на отдельной строке
# Вычисляем площадь прямоугольника
area = width * height

# ❌ Плохо: комментарий в конце длинной строки
area = width * height  # вычисляем площадь

# ✅ Хорошо: docstring для функций
def calculate_area(width, height):
    """
    Вычисляет площадь прямоугольника.
    
    Args:
        width: ширина прямоугольника
        height: высота прямоугольника
    
    Returns:
        площадь прямоугольника
    """
    return width * height
```

---

## **11. Операторы сравнения с None**

```python
# ✅ Хорошо
if value is None:
    pass

if value is not None:
    pass

# ❌ Плохо
if value == None:
    pass

if value != None:
    pass
```

---

## **12. Использование `not`**

```python
# ✅ Хорошо
if not is_valid:
    pass

# ❌ Плохо: двойное отрицание
if not is_not_valid:
    pass
```

---

## **Быстрая проверка кода на PEP 8**

```bash
# Установка линтера
pip install flake8

# Проверка файла
flake8 my_file.py

# Автоматическое исправление
pip install black
black my_file.py
```

---

## **Пример правильного кода:**

```python
#!/usr/bin/env python3
"""
Модуль для работы с пользователями.
"""

import json
import os
from datetime import datetime


class UserProfile:
    """Класс профиля пользователя."""
    
    DEFAULT_AVATAR = "default.png"
    
    def __init__(self, username: str, email: str):
        """
        Инициализация профиля пользователя.
        
        Args:
            username: имя пользователя
            email: email адрес
        """
        self.username = username
        self.email = email
        self._created_at = datetime.now()
    
    def get_info(self) -> str:
        """Возвращает информацию о пользователе."""
        return f"User: {self.username}, Email: {self.email}"
    
    def _validate_email(self) -> bool:
        """Приватный метод проверки email."""
        return '@' in self.email


def create_user(username: str, email: str) -> UserProfile:
    """Создаёт и возвращает нового пользователя."""
    if not username or not email:
        raise ValueError("Username and email are required")
    return UserProfile(username, email)


if __name__ == "__main__":
    user = create_user("john_doe", "john@example.com")
    print(user.get_info())
```

---

**Главное правило PEP 8:** читаемость важнее строгого следования правилам. Но лучше следовать правилам, чтобы ваш код понимали другие разработчики.
