# 📘 **ПЛАН ИЗУЧЕНИЯ: JavaScript/Node.js для серверной разработки**

## 🎯 **ЦЕЛЬ КУРСА**
Освоить разработку серверной части информационных систем на Node.js и Express.js с полным циклом: от настройки окружения до деплоя.

**Уровень**: Начинающий → Продвинутый  
**Длительность**: 8 недель (интенсив) / 16 недель (стандарт)  
**Формат**: Теория + Практика + Проект

---

# 🗓️ **ПОНЕДЕЛЬНЫЙ ПЛАН ИЗУЧЕНИЯ**

---

## 🔵 **НЕДЕЛЯ 1: Основы JavaScript и Node.js**

### 📌 **Тема 1.1: Асинхронность в JavaScript**
- [ ] Синхронный vs Асинхронный код
- [ ] Callback-функции (✅ понять, но НЕ использовать в новом коде)
- [ ] Промисы (Promise): `.then()`, `.catch()`, `.finally()`
- [ ] Async/Await — современный стандарт
- [ ] Обработка ошибок в асинхронном коде (try/catch)

**🛠️ Практика:**
```javascript
// ✅ Современный подход (async/await)
async function getUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
```

**📝 Задание:**
1. Написать 3 функции с async/await
2. Сымитировать запрос к API с задержкой (setTimeout + Promise)
3. Обработать ошибку несуществующего пользователя

---

### 📌 **Тема 1.2: Модули и пакетный менеджер npm**
- [ ] Установка Node.js (LTS версия)
- [ ] Инициализация проекта: `npm init -y`
- [ ] Структура `package.json`
- [ ] Установка зависимостей: `npm install <package>` / `npm i`
- [ ] devDependencies vs dependencies
- [ ] `node_modules` и `.gitignore`
- [ ] Скрипты npm: `"start"`, `"dev"`, `"test"`

**🛠️ Практика:**
```bash
mkdir my-server
cd my-server
npm init -y
npm install express
npm install -D nodemon
```

**📝 Задание:**
1. Создать проект и установить Express
2. Добавить скрипт `"dev": "nodemon index.js"`
3. Настроить `.gitignore` (включить node_modules)

---

## 🟢 **НЕДЕЛЯ 2: Введение в Express.js**

### 📌 **Тема 2.1: Первый сервер на Express**
- [ ] Подключение Express: `const express = require('express')`
- [ ] Создание экземпляра приложения
- [ ] Базовые маршруты: `app.get()`, `app.post()`
- [ ] Запуск сервера: `app.listen()`
- [ ] Обработка URL-параметров: `req.params`
- [ ] Обработка query-параметров: `req.query`

**🛠️ Практика:**
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
```

**📝 Задание:**
1. Создать GET-эндпоинт `/user/:id`, возвращающий ID пользователя
2. Создать эндпоинт `/search?q=...`, возвращающий поисковый запрос

---

### 📌 **Тема 2.2: Обработка данных и маршрутизация**
- [ ] Middleware для JSON: `express.json()`
- [ ] Middleware для форм: `express.urlencoded({ extended: true })`
- [ ] Работа с телом запроса: `req.body`
- [ ] Разделение маршрутов: `express.Router()`
- [ ] Организация файлов: `/routes` папка

**🛠️ Практика:**
```javascript
// routes/users.js
const router = express.Router();

router.post('/users', (req, res) => {
    const { name, email } = req.body;
    res.json({ message: `Создан пользователь ${name}` });
});

module.exports = router;
```

**📝 Задание:**
1. Создать роутер для пользователей (GET, POST, PUT, DELETE)
2. Добавить валидацию обязательных полей

---

## 🟡 **НЕДЕЛЯ 3: Продвинутый Express и Middleware**

### 📌 **Тема 3.1: Middleware — сердце Express**
- [ ] Что такое middleware? (req, res, next)
- [ ] Встроенные middleware
- [ ] Кастомные middleware
- [ ] Глобальные vs локальные middleware
- [ ] Порядок выполнения middleware
- [ ] Middleware для логирования
- [ ] Middleware для CORS

**🛠️ Практика — Логгер запросов:**
```javascript
// Логирование всех запросов
app.use((req, res, next) => {
    console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Проверка авторизации
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    next();
};
```

**📝 Задание:**
1. Создать middleware для логирования в файл
2. Создать middleware для проверки API-ключа
3. Настроить CORS для всех маршрутов

---

### 📌 **Тема 3.2: Обработка ошибок**
- [ ] Синхронные ошибки — Express ловит автоматически
- [ ] Асинхронные ошибки — нужно передавать в `next()`
- [ ] Централизованный обработчик ошибок
- [ ] Кастомные классы ошибок
- [ ] HTTP-статусы: 400, 401, 403, 404, 500

**🛠️ Практика — Error Handler:**
```javascript
// Кастомный класс ошибки
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

// Глобальный обработчик (ВСЕГДА в конце)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Внутренняя ошибка сервера';
    
    console.error(`❌ ${status}: ${message}`);
    res.status(status).json({ error: message });
});
```

**📝 Задание:**
1. Реализовать обработчик 404 (маршрут не найден)
2. Создать классы ошибок: `ValidationError`, `NotFoundError`
3. Добавить try/catch во все асинхронные роуты

---

## 🟠 **НЕДЕЛЯ 4: Работа с базами данных**

### 📌 **Тема 4.1: Подключение к БД (PostgreSQL/MySQL)**
- [ ] Установка драйвера: `pg` (PostgreSQL) или `mysql2`
- [ ] Создание пула соединений
- [ ] Конфигурация через переменные окружения (dotenv)
- [ ] Выполнение запросов: `pool.query()`
- [ ] Защита от SQL-инъекций

**🛠️ Практика:**
```javascript
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Запрос с параметрами (БЕЗОПАСНО!)
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]  // ✅ Защита от SQL-инъекций
    );
    res.json(result.rows);
});
```

**📝 Задание:**
1. Подключить PostgreSQL к проекту
2. Создать таблицу `users` (id, name, email, created_at)
3. Реализовать CRUD для пользователей с БД

---

### 📌 **Тема 4.2: ORM — Sequelize / Prisma (по выбору)**
- [ ] Установка и настройка ORM
- [ ] Определение моделей
- [ ] Миграции
- [ ] CRUD через ORM-методы
- [ ] Отношения (1:1, 1:M, M:N)

**🛠️ Практика (Sequelize):**
```javascript
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING }
});

// Синхронизация с БД
await sequelize.sync({ alter: true });
```

**📝 Задание:**
1. Переписать CRUD с SQL-запросов на ORM
2. Создать модель `Post` и связать с `User` (1 ко многим)

---

## 🔴 **НЕДЕЛЯ 5: Аутентификация и безопасность**

### 📌 **Тема 5.1: Регистрация и хэширование паролей**
- [ ] Установка `bcrypt`
- [ ] Хэширование пароля при регистрации
- [ ] Сравнение пароля при входе
- [ ] Валидация данных (Joi / express-validator)

**🛠️ Практика:**
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
```

---

### 📌 **Тема 5.2: JWT — JSON Web Tokens**
- [ ] Установка `jsonwebtoken`
- [ ] Создание токена при входе: `jwt.sign()`
- [ ] Верификация токена: `jwt.verify()`
- [ ] Middleware для проверки JWT
- [ ] Хранение секрета в `.env`

**🛠️ Практика:**
```javascript
const jwt = require('jsonwebtoken');

// Создание токена
const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);

// Middleware проверки
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
```

**📝 Задание:**
1. Добавить регистрацию с хэшированием пароля
2. Добавить вход, возвращающий JWT
3. Защитить роуты с помощью JWT-мидлвара

---

### 📌 **Тема 5.3: Безопасность**
- [ ] helmet — защита заголовков
- [ ] rate-limiter — защита от брутфорса
- [ ] Валидация и санитизация входных данных
- [ ] CORS — настройка разрешенных источников

**🛠️ Практика:**
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100 // максимум 100 запросов с одного IP
});
app.use('/api', limiter);
```

---

## 🟣 **НЕДЕЛЯ 6: Тестирование и документирование**

### 📌 **Тема 6.1: Тестирование API**
- [ ] Unit-тесты (Jest)
- [ ] Интеграционное тестирование
- [ ] Мокирование БД
- [ ] Supertest для HTTP-тестов

**🛠️ Практика:**
```javascript
// users.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /users', () => {
    it('should return 200 OK', async () => {
        const res = await request(app)
            .get('/api/users')
            .expect(200);
    });
});
```

---

### 📌 **Тема 6.2: Документирование API**
- [ ] Swagger / OpenAPI
- [ ] Установка swagger-ui-express
- [ ] Аннотации JSDoc для генерации документации
- [ ] YAML/JSON спецификация

**🛠️ Практика:**
```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

**📝 Задание:**
1. Написать тесты для 3 эндпоинтов
2. Создать Swagger-документацию для всех API

---

## 🟤 **НЕДЕЛЯ 7: Продвинутые темы**

### 📌 **Тема 7.1: Файловый загрузчик (Multer)**
- [ ] Установка multer
- [ ] Настройка хранилища (diskStorage / memoryStorage)
- [ ] Фильтрация файлов по типу
- [ ] Ограничение размера

---

### 📌 **Тема 7.2: WebSockets (Socket.io)**
- [ ] Установка socket.io
- [ ] Создание WebSocket-сервера
- [ ] Эмиттеры и слушатели
- [ ] Комнаты (rooms)

---

## ⚫ **НЕДЕЛЯ 8: Развертывание и DevOps**

### 📌 **Тема 8.1: Подготовка к продакшену**
- [ ] Переменные окружения (production mode)
- [ ] Логирование (winston / pino)
- [ ] PM2 — менеджер процессов
- [ ] Сбор статистики

**🛠️ Практика:**
```bash
npm install -g pm2
pm2 start index.js --name my-api
pm2 save
pm2 startup
```

---

### 📌 **Тема 8.2: Docker контейнеризация**
- [ ] Dockerfile для Node.js приложения
- [ ] .dockerignore
- [ ] Docker Compose (Node + PostgreSQL)
- [ ] Мультистейдж сборка

**🛠️ Практика:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

---

### 📌 **Тема 8.3: Деплой на облачные платформы**
- [ ] Render.com / Railway — простой старт
- [ ] Heroku
- [ ] Vercel для Node.js
- [ ] AWS Elastic Beanstalk / EC2

---

# 🎯 **ИТОГОВЫЙ ПРОЕКТ**

## **Backend для интернет-магазина / Блога / Todo-приложения**

**Требования:**
1. ✅ Express.js сервер
2. ✅ PostgreSQL + Sequelize/Prisma
3. ✅ JWT аутентификация (регистрация, вход)
4. ✅ Ролевая модель (admin/user)
5. ✅ CRUD для 2+ сущностей
6. ✅ Валидация данных
7. ✅ Централизованная обработка ошибок
8. ✅ Swagger документация
9. ✅ Rate limiting
10. ✅ Деплой на Render/Railway

---

# 📚 **РЕСУРСЫ ДЛЯ ИЗУЧЕНИЯ**

### **Бесплатные курсы:**
1. [Node.js Tutorial — Programming with Mosh](https://www.youtube.com/watch?v=TlB_eWDSMt4)
2. [Express JS Crash Course — Traversy Media](https://www.youtube.com/watch?v=L72fhGm1tfE)
3. [JWT Authentication Tutorial — Web Dev Simplified](https://www.youtube.com/watch?v=7Q17ubqLfaM)

### **Документация:**
1. [Официальная документация Node.js](https://nodejs.org/en/docs/)
2. [Express.js Guide](https://expressjs.com/en/guide/routing.html)
3. [JWT.io](https://jwt.io/introduction)

### **Книги:**
1. "Node.js Design Patterns" — Mario Casciaro
2. "RESTful Web APIs" — Leonard Richardson

---

# ✅ **ЧЕК-ЛИСТ ПРОГРЕССА**

```
[ ] НЕДЕЛЯ 1: Асинхронность + npm
[ ] НЕДЕЛЯ 2: Базовый Express
[ ] НЕДЕЛЯ 3: Middleware + Ошибки
[ ] НЕДЕЛЯ 4: Базы данных + ORM
[ ] НЕДЕЛЯ 5: Аутентификация + JWT
[ ] НЕДЕЛЯ 6: Тестирование + Swagger
[ ] НЕДЕЛЯ 7: Продвинутые темы
[ ] НЕДЕЛЯ 8: Деплой
[ ] 🎉 ИТОГОВЫЙ ПРОЕКТ
```

---

## 💡 **СОВЕТЫ ДЛЯ МАКСИМАЛЬНОЙ ЭФФЕКТИВНОСТИ**

1. **Не копируй код** — переписывай руками
2. **Каждый день — 1 час кода**
3. **После каждой темы — мини-проект**
4. **Читай чужие проекты на GitHub**
5. **Задавай вопросы** — Stack Overflow, Telegram-чаты
6. **Веди конспект ошибок**

---

**🚀 Твой путь от новичка до Junior Backend Developer расписан! Просто следуй плану.**
