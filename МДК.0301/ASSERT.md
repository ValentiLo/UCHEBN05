 **без использования `assert`**, используя обычные проверки с `if` и исключениями.

---

## **Почему иногда лучше без assert?**

1. **`assert` может быть отключен** (при запуске с флагом `-O`)
2. **Нужна гарантированная проверка** в production
3. **Более явная обработка ошибок**

---

## **1. Переписываем функцию divide**

### **Вариант с assert:**
```python
def divide(a: int, b: int) -> float:
    """Деление с проверкой"""
    assert b != 0, "На ноль делить нельзя!"
    return a / b
```

### **Вариант без assert (с if):**
```python
def divide(a: int, b: int) -> float:
    """Деление с проверкой"""
    if b == 0:
        raise ValueError("На ноль делить нельзя!")  # Явное исключение
    return a / b

# Использование
try:
    result = divide(10, 0)
    print(result)
except ValueError as e:
    print(f"Ошибка: {e}")  # Ошибка: На ноль делить нельзя!
```

### **Более продвинутый вариант:**
```python
def divide(a: int, b: int) -> float:
    """
    Деление с проверкой
    
    Args:
        a: делимое
        b: делитель
    
    Returns:
        Результат деления
    
    Raises:
        ValueError: если делитель равен 0
        TypeError: если аргументы не числа
    """
    # Проверка типов
    if not isinstance(a, (int, float)):
        raise TypeError(f"Делимое должно быть числом, получен {type(a).__name__}")
    
    if not isinstance(b, (int, float)):
        raise TypeError(f"Делитель должен быть числом, получен {type(b).__name__}")
    
    # Проверка значения
    if b == 0:
        raise ValueError("На ноль делить нельзя!")
    
    return a / b

# Примеры использования
print(divide(10, 2))           # 5.0
print(divide(10.5, 2))         # 5.25

try:
    print(divide(10, 0))
except ValueError as e:
    print(f"Ошибка: {e}")      # Ошибка: На ноль делить нельзя!

try:
    print(divide("10", 2))
except TypeError as e:
    print(f"Ошибка: {e}")      # Ошибка: Делимое должно быть числом, получен str
```

---

## **2. Переписываем функцию register_user**

### **Вариант с assert:**
```python
def register_user(username: str, age: int):
    """Регистрация пользователя с проверками"""
    assert len(username) >= 3, "Имя слишком короткое (минимум 3 символа)"
    assert len(username) <= 20, "Имя слишком длинное (максимум 20 символов)"
    assert age >= 0, "Возраст не может быть отрицательным"
    assert age <= 150, "Возраст слишком большой"
    
    print(f"Пользователь {username} зарегистрирован!")
```

### **Вариант без assert (с if):**
```python
def register_user(username: str, age: int):
    """Регистрация пользователя с проверками"""
    
    # Проверка имени
    if len(username) < 3:
        raise ValueError("Имя слишком короткое (минимум 3 символа)")
    
    if len(username) > 20:
        raise ValueError("Имя слишком длинное (максимум 20 символов)")
    
    # Проверка возраста
    if age < 0:
        raise ValueError("Возраст не может быть отрицательным")
    
    if age > 150:
        raise ValueError("Возраст слишком большой")
    
    print(f"Пользователь {username} зарегистрирован!")

# Использование
try:
    register_user("Анна", 25)
    print("✅ Регистрация успешна")
except ValueError as e:
    print(f"❌ Ошибка: {e}")

try:
    register_user("А", 25)  # Слишком короткое имя
except ValueError as e:
    print(f"❌ Ошибка: {e}")

try:
    register_user("Анна", -5)  # Отрицательный возраст
except ValueError as e:
    print(f"❌ Ошибка: {e}")
```

### **Улучшенная версия с отдельными исключениями:**
```python
class ValidationError(Exception):
    """Базовое исключение для ошибок валидации"""
    pass

class UsernameTooShortError(ValidationError):
    """Имя пользователя слишком короткое"""
    pass

class UsernameTooLongError(ValidationError):
    """Имя пользователя слишком длинное"""
    pass

class AgeNegativeError(ValidationError):
    """Возраст отрицательный"""
    pass

class AgeTooHighError(ValidationError):
    """Возраст слишком большой"""
    pass

def register_user(username: str, age: int):
    """Регистрация пользователя с проверками"""
    
    # Проверка имени
    if len(username) < 3:
        raise UsernameTooShortError(f"Имя '{username}' слишком короткое (минимум 3 символа)")
    
    if len(username) > 20:
        raise UsernameTooLongError(f"Имя '{username}' слишком длинное (максимум 20 символов)")
    
    # Проверка возраста
    if age < 0:
        raise AgeNegativeError(f"Возраст {age} не может быть отрицательным")
    
    if age > 150:
        raise AgeTooHighError(f"Возраст {age} слишком большой")
    
    print(f"✅ Пользователь {username} (возраст: {age}) зарегистрирован!")
    return {"username": username, "age": age}

# Использование с обработкой разных ошибок
def register_with_handling(username, age):
    """Регистрация с обработкой конкретных ошибок"""
    try:
        user = register_user(username, age)
        return user
    except UsernameTooShortError as e:
        print(f"❌ Ошибка имени: {e}")
        return None
    except UsernameTooLongError as e:
        print(f"❌ Ошибка имени: {e}")
        return None
    except AgeNegativeError as e:
        print(f"❌ Ошибка возраста: {e}")
        return None
    except AgeTooHighError as e:
        print(f"❌ Ошибка возраста: {e}")
        return None
    except ValidationError as e:
        print(f"❌ Ошибка валидации: {e}")
        return None

# Тестируем
register_with_handling("Анна", 25)      # ✅ Успех
register_with_handling("А", 25)         # ❌ Ошибка имени
register_with_handling("Анна", -5)      # ❌ Ошибка возраста
register_with_handling("Анна", 200)     # ❌ Ошибка возраста
```

---

## **3. Полный пример: класс User с валидацией**

### **Вариант с assert (для сравнения):**
```python
class User:
    def __init__(self, username: str, age: int, email: str):
        assert len(username) >= 3, "Имя слишком короткое"
        assert len(username) <= 20, "Имя слишком длинное"
        assert 0 <= age <= 150, "Некорректный возраст"
        assert '@' in email, "Некорректный email"
        
        self.username = username
        self.age = age
        self.email = email
```

### **Вариант без assert (рекомендуемый для production):**
```python
class UserValidationError(Exception):
    """Исключение для ошибок валидации пользователя"""
    pass

class User:
    """Класс пользователя с валидацией"""
    
    def __init__(self, username: str, age: int, email: str):
        """
        Создание пользователя с проверкой данных
        
        Args:
            username: имя пользователя (3-20 символов)
            age: возраст (0-150 лет)
            email: email адрес
        
        Raises:
            UserValidationError: если данные некорректны
        """
        self._validate_username(username)
        self._validate_age(age)
        self._validate_email(email)
        
        self.username = username
        self.age = age
        self.email = email
    
    def _validate_username(self, username: str):
        """Проверка имени пользователя"""
        if not isinstance(username, str):
            raise UserValidationError(f"Имя должно быть строкой, получен {type(username).__name__}")
        
        if len(username) < 3:
            raise UserValidationError(f"Имя '{username}' слишком короткое (минимум 3 символа)")
        
        if len(username) > 20:
            raise UserValidationError(f"Имя '{username}' слишком длинное (максимум 20 символов)")
        
        if not username.isalnum():
            raise UserValidationError(f"Имя '{username}' может содержать только буквы и цифры")
    
    def _validate_age(self, age: int):
        """Проверка возраста"""
        if not isinstance(age, int):
            raise UserValidationError(f"Возраст должен быть целым числом, получен {type(age).__name__}")
        
        if age < 0:
            raise UserValidationError(f"Возраст {age} не может быть отрицательным")
        
        if age > 150:
            raise UserValidationError(f"Возраст {age} слишком большой (максимум 150 лет)")
    
    def _validate_email(self, email: str):
        """Проверка email"""
        if not isinstance(email, str):
            raise UserValidationError(f"Email должен быть строкой, получен {type(email).__name__}")
        
        if '@' not in email:
            raise UserValidationError(f"Email '{email}' должен содержать @")
        
        if '.' not in email.split('@')[1]:
            raise UserValidationError(f"Email '{email}' должен содержать домен")
    
    def __str__(self):
        return f"User(username='{self.username}', age={self.age}, email='{self.email}')"

# Функция для безопасного создания пользователя
def create_user_safely(username: str, age: int, email: str):
    """Безопасное создание пользователя с обработкой ошибок"""
    try:
        user = User(username, age, email)
        print(f"✅ Пользователь создан: {user}")
        return user
    except UserValidationError as e:
        print(f"❌ Ошибка создания пользователя: {e}")
        return None

# Тестируем
print("=== Тестирование создания пользователей ===\n")

# Успешные случаи
create_user_safely("Иван", 25, "ivan@example.com")
create_user_safely("Мария", 30, "maria@mail.ru")

print("\n=== Ошибочные случаи ===\n")

# Ошибки
create_user_safely("А", 25, "ivan@example.com")          # Слишком короткое имя
create_user_safely("ОченьДлинноеИмяКотороеНеПодходит", 25, "ivan@example.com")  # Слишком длинное
create_user_safely("Иван", -5, "ivan@example.com")       # Отрицательный возраст
create_user_safely("Иван", 200, "ivan@example.com")      # Слишком большой возраст
create_user_safely("Иван", 25, "invalid-email")          # Неправильный email
create_user_safely(123, 25, "ivan@example.com")          # Неправильный тип имени
```

---

## **4. Универсальная функция-валидатор**

```python
from typing import Any, Callable, List, Tuple

class Validator:
    """Универсальный класс для валидации"""
    
    @staticmethod
    def validate_username(username: str) -> Tuple[bool, str]:
        """Проверяет имя пользователя"""
        if not username:
            return False, "Имя не может быть пустым"
        if len(username) < 3:
            return False, "Имя слишком короткое (минимум 3 символа)"
        if len(username) > 20:
            return False, "Имя слишком длинное (максимум 20 символов)"
        if not username.isalnum():
            return False, "Имя может содержать только буквы и цифры"
        return True, ""
    
    @staticmethod
    def validate_age(age: Any) -> Tuple[bool, str]:
        """Проверяет возраст"""
        if not isinstance(age, int):
            return False, f"Возраст должен быть целым числом, получен {type(age).__name__}"
        if age < 0:
            return False, "Возраст не может быть отрицательным"
        if age > 150:
            return False, "Возраст слишком большой (максимум 150 лет)"
        return True, ""
    
    @staticmethod
    def validate_email(email: str) -> Tuple[bool, str]:
        """Проверяет email"""
        if not email:
            return False, "Email не может быть пустым"
        if '@' not in email:
            return False, "Email должен содержать @"
        if '.' not in email.split('@')[1]:
            return False, "Email должен содержать домен"
        return True, ""

def register_user_with_validator(username: str, age: int, email: str):
    """Регистрация с использованием валидатора"""
    errors = []
    
    # Проверяем каждое поле
    valid, msg = Validator.validate_username(username)
    if not valid:
        errors.append(f"username: {msg}")
    
    valid, msg = Validator.validate_age(age)
    if not valid:
        errors.append(f"age: {msg}")
    
    valid, msg = Validator.validate_email(email)
    if not valid:
        errors.append(f"email: {msg}")
    
    # Если есть ошибки, выбрасываем исключение
    if errors:
        raise ValueError("\n".join(errors))
    
    print(f"✅ Пользователь {username} успешно зарегистрирован!")
    return {"username": username, "age": age, "email": email}

# Тестируем
try:
    user = register_user_with_validator("Иван", 25, "ivan@example.com")
    print(user)
except ValueError as e:
    print(f"❌ Ошибка: {e}")

try:
    user = register_user_with_validator("A", -5, "invalid")
except ValueError as e:
    print(f"\n❌ Ошибки:\n{e}")
```

---

## **5. Использование dataclasses с валидацией**

```python
from dataclasses import dataclass, field
from typing import Any

@dataclass
class User:
    """Пользователь с валидацией через dataclass"""
    username: str
    age: int
    email: str
    
    def __post_init__(self):
        """Валидация после инициализации"""
        self._validate()
    
    def _validate(self):
        """Проверка всех полей"""
        errors = []
        
        # Проверка username
        if not isinstance(self.username, str):
            errors.append(f"username должен быть строкой, получен {type(self.username).__name__}")
        elif len(self.username) < 3:
            errors.append("username слишком короткий (минимум 3 символа)")
        elif len(self.username) > 20:
            errors.append("username слишком длинный (максимум 20 символов)")
        
        # Проверка age
        if not isinstance(self.age, int):
            errors.append(f"age должен быть целым числом, получен {type(self.age).__name__}")
        elif self.age < 0:
            errors.append("age не может быть отрицательным")
        elif self.age > 150:
            errors.append("age слишком большой (максимум 150)")
        
        # Проверка email
        if not isinstance(self.email, str):
            errors.append(f"email должен быть строкой, получен {type(self.email).__name__}")
        elif '@' not in self.email:
            errors.append("email должен содержать @")
        elif '.' not in self.email.split('@')[1]:
            errors.append("email должен содержать домен")
        
        if errors:
            raise ValueError("\n".join(errors))

# Создаем пользователей
try:
    user1 = User("Иван", 25, "ivan@example.com")
    print(f"✅ {user1}")
except ValueError as e:
    print(f"❌ {e}")

try:
    user2 = User("A", -5, "invalid")
except ValueError as e:
    print(f"\n❌ Ошибки:\n{e}")
```

---

## **Сравнение подходов**

| Характеристика | assert | if + raise |
|----------------|--------|------------|
| **Всегда выполняется** | ❌ Нет (может быть отключен) | ✅ Да |
| **Production-ready** | ❌ Нет | ✅ Да |
| **Контроль над ошибками** | ❌ Только AssertionError | ✅ Любые исключения |
| **Сообщения об ошибках** | ✅ Да | ✅ Да |
| **Сложность кода** | Простой | Немного сложнее |
| **Рекомендация** | Отладка, тесты | Production код |

---

## **Итог: когда что использовать**

```python
# ✅ Для отладки и тестов
def debug_function(x):
    assert x > 0, "x должен быть положительным"  # Хорошо для отладки
    return x * 2

# ✅ Для production кода
def production_function(x):
    if x <= 0:
        raise ValueError("x должен быть положительным")  # Всегда работает
    return x * 2

# ✅ Смешанный подход
def mixed_function(x):
    # Отладочная проверка (может быть отключена)
    assert x is not None, "x не должен быть None"
    
    # Production проверка (всегда выполняется)
    if not isinstance(x, (int, float)):
        raise TypeError("x должен быть числом")
    
    if x <= 0:
        raise ValueError("x должен быть положительным")
    
    return x * 2
```

**Главное правило:**
- **Для отладки** - используйте `assert`
- **Для защиты программы** - используйте `if` + `raise`

