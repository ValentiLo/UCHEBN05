# Практическое занятие 2: Словари (объекты) в Python

## 1. Создание словарей

### Литеральная нотация
```python
user = {
    "name": "Анна",
    "age": 25,
    "email": "anna@example.com",
    "is_admin": False
}

# Или с помощью dict()
user2 = dict(name="Иван", age=30, email="ivan@example.com")
```

### Словарь с вложенными структурами
```python
student = {
    "name": "Мария",
    "grades": [5, 4, 3, 5, 4],
    "address": {
        "city": "Москва",
        "street": "Ленина"
    },
    "subjects": {"math", "physics", "chemistry"}
}
```

## 2. Ссылочный тип

```python
# Примитивы копируются по значению
a = 10
b = a  # b = 10 (копия значения)
b = 20  # a останется 10

# Словари копируются по ссылке
dict1 = {"x": 10}
dict2 = dict1  # dict2 ссылается на тот же объект
dict2["x"] = 20  # dict1["x"] тоже станет 20!

# Создание копий
import copy

shallow_copy = dict1.copy()  # поверхностная копия
deep_copy = copy.deepcopy(dict1)  # глубокая копия
```

## 3. Перебор словарей

### Перебор ключей
```python
product = {
    "id": 1,
    "name": "Ноутбук",
    "price": 50000,
    "in_stock": True
}

# Перебор ключей
for key in product:
    print(f"Ключ: {key}")

# Явно через keys()
for key in product.keys():
    print(f"Ключ: {key} -> Значение: {product[key]}")
```

### Перебор значений
```python
# Перебор значений
for value in product.values():
    print(f"Значение: {value}")
```

### Перебор пар ключ-значение
```python
# Перебор пар (наиболее полезный способ)
for key, value in product.items():
    print(f"{key}: {value}")
```

## 4. Работа с ключами

### Проверка наличия ключа
```python
book = {
    "title": "1984",
    "author": "Оруэлл",
    "year": 1949
}

# Несколько способов проверки
print("title" in book)  # True
print("publisher" in book)  # False
print(book.get("author"))  # "Оруэлл"
print(book.get("publisher", "Не указано"))  # "Не указано"
```

### Добавление и удаление элементов
```python
config = {"theme": "dark"}

# Добавление
config["language"] = "ru"
config.update({"font_size": 14, "notifications": True})

# Удаление
value = config.pop("theme")  # удаляет и возвращает значение
del config["language"]  # просто удаляет
config.clear()  # очищает весь словарь
```

### Получение списка ключей и значений
```python
keys = list(product.keys())  # ['id', 'name', 'price', 'in_stock']
values = list(product.values())  # [1, 'Ноутбук', 50000, True]
items = list(product.items())  # [('id', 1), ('name', 'Ноутбук'), ...]
```

## 5. Объединение словарей

### Python 3.9+ (операторы | и |=)
```python
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}
dict3 = {"d": 5}

# Создание нового словаря (объединение)
merged = dict1 | dict2 | dict3  # {'a': 1, 'b': 3, 'c': 4, 'd': 5}

# Обновление существующего
dict1 |= dict2  # dict1 теперь {'a': 1, 'b': 3, 'c': 4}
```

### Метод update()
```python
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}

dict1.update(dict2)  # dict1 теперь {'a': 1, 'b': 3, 'c': 4}
```

### Через распаковку (Python 3.5+)
```python
merged = {**dict1, **dict2, **dict3}
```

## 6. Словарные включения (Dictionary Comprehensions)

```python
# Создание словаря из списка
numbers = [1, 2, 3, 4, 5]
squares = {x: x**2 for x in numbers}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# С фильтрацией
even_squares = {x: x**2 for x in numbers if x % 2 == 0}
# {2: 4, 4: 16}

# Из двух списков
keys = ['a', 'b', 'c']
values = [1, 2, 3]
combined = {k: v for k, v in zip(keys, values)}
# {'a': 1, 'b': 2, 'c': 3}
```

## 7. Опциональная цепочка в Python

Python не имеет встроенного оператора `?.` как JavaScript, но есть несколько способов эмулировать его поведение:

### Через try-except
```python
company = {
    "name": "TechCorp",
    "address": {
        "city": "Москва",
        "street": "Ленина"
    }
}

try:
    city = company["address"]["city"]
except (KeyError, TypeError):
    city = None
```

### Через get() с значением по умолчанию
```python
city = company.get("address", {}).get("city")  # "Москва"
zip_code = company.get("address", {}).get("zip_code")  # None
```

### Кастомная функция
```python
def safe_get(d, *keys, default=None):
    """Безопасное получение значения из вложенного словаря"""
    for key in keys:
        try:
            d = d[key]
        except (KeyError, TypeError):
            return default
    return d

# Использование
city = safe_get(company, "address", "city")  # "Москва"
floor = safe_get(company, "address", "building", "floor")  # None
```

### Через библиотеку (Python 3.8+)
```python
# Использование pydash
# pip install pydash
from pydash import get

city = get(company, "address.city")  # "Москва"
floor = get(company, "address.building.floor", default=1)  # 1
```

## 8. Defaultdict и Counter

```python
from collections import defaultdict, Counter

# defaultdict - словарь со значением по умолчанию
word_count = defaultdict(int)
for word in ["apple", "banana", "apple", "orange"]:
    word_count[word] += 1
# defaultdict(<class 'int'>, {'apple': 2, 'banana': 1, 'orange': 1})

# Counter - подсчет элементов
colors = ["red", "blue", "red", "green", "blue", "blue"]
color_count = Counter(colors)
print(color_count.most_common(1))  # [('blue', 3)]
```

## Практические задания

### Задание 1: Создание и манипуляции
```python
# Создайте словарь "студент" с данными и методами
def create_student(name, age, grades):
    return {
        "name": name,
        "age": age,
        "grades": grades,
        "average": lambda: sum(grades) / len(grades) if grades else 0
    }

student = create_student("Иван", 20, [4, 5, 3, 4, 5])
print(f"Средний балл: {student['average']()}")
```

### Задание 2: Объединение словарей с приоритетами
```python
default_settings = {"theme": "light", "language": "en", "notifications": True}
user_settings = {"language": "ru", "font_size": 14}
session_settings = {"theme": "dark"}

# Объединить с приоритетом: session > user > default
final_settings = {**default_settings, **user_settings, **session_settings}
```

### Задание 3: Безопасный доступ к данным
```python
def get_nested_value(data, keys, default=None):
    """Получение значения по цепочке ключей"""
    current = data
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return default
    return current

# Тестирование
user_data = {"profile": {"contact": {"email": "test@example.com"}}}
email = get_nested_value(user_data, ["profile", "contact", "email"])
```

### Задание 4: Трансформация словаря
```python
def transform_dict(original):
    """Возвращает новый словарь, где все строки в верхнем регистре"""
    return {
        key: (value.upper() if isinstance(value, str) else value)
        for key, value in original.items()
    }

data = {"name": "john", "age": 25, "city": "new york"}
transformed = transform_dict(data)
```

## Полезные методы и особенности

1. **setdefault()** - получает значение или устанавливает по умолчанию
   ```python
   d = {}
   d.setdefault("count", 0)  # если нет ключа, создает со значением 0
   ```

2. **popitem()** - удаляет и возвращает последнюю пару (LIFO в Python 3.7+)

3. **fromkeys()** - создает словарь с ключами из последовательности
   ```python
   keys = ["a", "b", "c"]
   d = dict.fromkeys(keys, 0)  # {'a': 0, 'b': 0, 'c': 0}
   ```

4. **Порядок вставки** - в Python 3.7+ словари сохраняют порядок добавления элементов

Словари в Python — одна из самых мощных и часто используемых структур данных, их эффективное использование критически важно для написания качественного Python-кода.
