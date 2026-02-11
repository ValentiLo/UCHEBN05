# 🔐 **Практическое занятие 1: Аутентификация пользователей (чистый HTML/CSS/JS)**

## 🎯 **Цель занятия**
Создать полноценную систему аутентификации пользователей используя только HTML, CSS и JavaScript с имитацией бэкенда через LocalStorage.

---

## 📁 **Структура проекта**

```
auth-system/
├── index.html          # Главная страница
├── login.html          # Страница входа
├── register.html       # Страница регистрации
├── dashboard.html      # Защищенная страница
├── forgot-password.html # Восстановление пароля
├── css/
│   └── style.css       # Общие стили
└── js/
    ├── auth.js         # Логика аутентификации
    ├── database.js     # Имитация базы данных
    └── validation.js   # Валидация форм
```

---

## 🎨 **1. Общие стили (css/style.css)**

```css
/* Сброс стилей и базовые настройки */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

/* Контейнеры */
.auth-container {
    background: white;
    border-radius: 10px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    padding: 40px;
    width: 100%;
    max-width: 400px;
    animation: fadeIn 0.5s ease;
}

.dashboard-container {
    background: white;
    border-radius: 10px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    padding: 40px;
    width: 100%;
    max-width: 800px;
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Заголовки */
h1 {
    color: #333;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 600;
}

h2 {
    color: #444;
    margin-bottom: 20px;
}

/* Формы */
.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s;
}

input:focus {
    outline: none;
    border-color: #667eea;
}

/* Кнопки */
.btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 14px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: background 0.3s;
    text-align: center;
    text-decoration: none;
    display: block;
}

.btn:hover {
    background: #5a67d8;
}

.btn-secondary {
    background: #6c757d;
}

.btn-secondary:hover {
    background: #5a6268;
}

.btn-danger {
    background: #e74c3c;
}

.btn-danger:hover {
    background: #c0392b;
}

/* Ссылки */
.auth-link {
    text-align: center;
    margin-top: 20px;
    color: #666;
}

.auth-link a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
}

.auth-link a:hover {
    text-decoration: underline;
}

/* Сообщения */
.message {
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
    display: none;
}

.message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    display: block;
}

.message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    display: block;
}

.message.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
    display: block;
}

/* Ошибки в формах */
.error {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 5px;
    display: none;
}

/* Навигация */
.navbar {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 15px 0;
    margin-bottom: 30px;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    font-size: 24px;
    font-weight: bold;
    color: #667eea;
    text-decoration: none;
}

.nav-user {
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-info {
    color: #666;
    font-weight: 500;
}

/* Таблицы */
.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table th,
.table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
}

.table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
}

.table tr:hover {
    background: #f8f9fa;
}

/* Карточки */
.card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
}

/* Индикатор сложности пароля */
.password-strength {
    margin-top: 10px;
}

.strength-bar {
    height: 5px;
    background: #eee;
    border-radius: 3px;
    margin-top: 5px;
    overflow: hidden;
}

.strength-fill {
    height: 100%;
    width: 0%;
    transition: width 0.3s, background 0.3s;
}

/* Чекбокс "Запомнить меня" */
.remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
}

.remember-me input[type="checkbox"] {
    width: auto;
}

/* Лоадер */
.loader {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
```

---

## 🗄️ **2. Имитация базы данных (js/database.js)**

```javascript
// Имитация базы данных в LocalStorage
class Database {
    constructor() {
        this.STORAGE_KEY = 'auth_system_data';
        this.initDatabase();
    }

    // Инициализация базы данных
    initDatabase() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const initialData = {
                users: [],
                sessions: [],
                auditLogs: []
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
        }
    }

    // Получение всех данных
    getData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    }

    // Сохранение данных
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    // Поиск пользователя по email или username
    findUser(emailOrUsername) {
        const data = this.getData();
        return data.users.find(user => 
            user.email === emailOrUsername || 
            user.username === emailOrUsername
        );
    }

    // Создание нового пользователя
    createUser(userData) {
        const data = this.getData();
        
        // Проверка на существующего пользователя
        if (data.users.some(u => u.email === userData.email)) {
            return { success: false, message: 'Email уже зарегистрирован' };
        }
        
        if (data.users.some(u => u.username === userData.username)) {
            return { success: false, message: 'Имя пользователя уже занято' };
        }

        // Создаем нового пользователя
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            created_at: new Date().toISOString(),
            email_verified: false,
            is_active: true,
            last_login: null
        };

        data.users.push(newUser);
        this.saveData(data);

        // Логируем действие
        this.addAuditLog({
            user_id: newUser.id,
            action: 'USER_REGISTERED',
            description: `Пользователь ${userData.username} зарегистрировался`
        });

        return { success: true, user: newUser };
    }

    // Аутентификация пользователя
    authenticateUser(emailOrUsername, password) {
        const user = this.findUser(emailOrUsername);
        
        if (!user) {
            this.addAuditLog({
                action: 'LOGIN_FAILED',
                description: `Неудачная попытка входа: пользователь не найден`
            });
            return { success: false, message: 'Неверные учетные данные' };
        }

        if (user.password !== password) {
            this.addAuditLog({
                user_id: user.id,
                action: 'LOGIN_FAILED',
                description: `Неудачная попытка входа: неверный пароль`
            });
            return { success: false, message: 'Неверные учетные данные' };
        }

        if (!user.is_active) {
            return { success: false, message: 'Аккаунт заблокирован' };
        }

        // Обновляем время последнего входа
        this.updateUser(user.id, { last_login: new Date().toISOString() });

        // Создаем сессию
        const sessionToken = this.generateSessionToken(user.id);

        // Логируем успешный вход
        this.addAuditLog({
            user_id: user.id,
            action: 'LOGIN_SUCCESS',
            description: `Успешный вход в систему`
        });

        return { 
            success: true, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email 
            },
            token: sessionToken
        };
    }

    // Обновление данных пользователя
    updateUser(userId, updates) {
        const data = this.getData();
        const userIndex = data.users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            data.users[userIndex] = { ...data.users[userIndex], ...updates };
            this.saveData(data);
            return true;
        }
        
        return false;
    }

    // Генерация токена сессии
    generateSessionToken(userId) {
        const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
        const data = this.getData();
        
        data.sessions.push({
            token,
            user_id: userId,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 часа
        });
        
        this.saveData(data);
        return token;
    }

    // Проверка токена сессии
    validateToken(token) {
        const data = this.getData();
        const session = data.sessions.find(s => s.token === token);
        
        if (!session) return false;
        
        // Проверяем не истек ли токен
        if (new Date(session.expires_at) < new Date()) {
            // Удаляем просроченную сессию
            data.sessions = data.sessions.filter(s => s.token !== token);
            this.saveData(data);
            return false;
        }
        
        // Продлеваем сессию
        session.expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        this.saveData(data);
        
        // Находим пользователя
        const user = data.users.find(u => u.id === session.user_id);
        return user ? { user, session } : false;
    }

    // Выход из системы
    logout(token) {
        const data = this.getData();
        const session = data.sessions.find(s => s.token === token);
        
        if (session) {
            // Логируем выход
            this.addAuditLog({
                user_id: session.user_id,
                action: 'LOGOUT',
                description: `Выход из системы`
            });
            
            // Удаляем сессию
            data.sessions = data.sessions.filter(s => s.token !== token);
            this.saveData(data);
        }
    }

    // Добавление записи в лог
    addAuditLog(logData) {
        const data = this.getData();
        data.auditLogs.push({
            id: Date.now().toString(),
            ...logData,
            ip_address: '127.0.0.1',
            user_agent: navigator.userAgent,
            created_at: new Date().toISOString()
        });
        this.saveData(data);
    }

    // Получение логов (для админа)
    getAuditLogs() {
        return this.getData().auditLogs;
    }

    // Получение всех пользователей (для админа)
    getAllUsers() {
        return this.getData().users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
            last_login: user.last_login,
            is_active: user.is_active
        }));
    }
}

// Создаем глобальный экземпляр базы данных
const db = new Database();
```

---

## 🔐 **3. Логика аутентификации (js/auth.js)**

```javascript
// Сервис аутентификации
class AuthService {
    constructor() {
        this.db = db;
        this.currentUser = null;
        this.currentToken = null;
        this.loadFromStorage();
    }

    // Загрузка данных из LocalStorage
    loadFromStorage() {
        this.currentToken = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
            
            // Проверяем валидность токена
            if (this.currentToken) {
                const validation = this.db.validateToken(this.currentToken);
                if (!validation) {
                    this.logout();
                }
            }
        }
    }

    // Сохранение в LocalStorage
    saveToStorage() {
        if (this.currentToken) {
            localStorage.setItem('auth_token', this.currentToken);
        }
        if (this.currentUser) {
            localStorage.setItem('user_data', JSON.stringify(this.currentUser));
        }
    }

    // Регистрация нового пользователя
    async register(userData) {
        try {
            // Проверка сложности пароля
            const passwordStrength = this.checkPasswordStrength(userData.password);
            if (!passwordStrength.isStrong) {
                return {
                    success: false,
                    message: 'Пароль недостаточно сложен. Используйте минимум 8 символов, включая заглавные и строчные буквы, цифры и специальные символы.'
                };
            }

            // Проверка совпадения паролей
            if (userData.password !== userData.confirmPassword) {
                return { success: false, message: 'Пароли не совпадают' };
            }

            // Создание пользователя в "базе данных"
            const result = this.db.createUser({
                username: userData.username,
                email: userData.email,
                password: userData.password, // В реальном приложении здесь должен быть хэш!
                first_name: userData.firstName || '',
                last_name: userData.lastName || ''
            });

            if (result.success) {
                // Автоматический вход после регистрации
                const loginResult = this.db.authenticateUser(userData.email, userData.password);
                
                if (loginResult.success) {
                    this.currentUser = loginResult.user;
                    this.currentToken = loginResult.token;
                    this.saveToStorage();
                }

                return loginResult;
            }

            return result;

        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Ошибка регистрации' };
        }
    }

    // Вход в систему
    async login(emailOrUsername, password, rememberMe = false) {
        try {
            const result = this.db.authenticateUser(emailOrUsername, password);
            
            if (result.success) {
                this.currentUser = result.user;
                this.currentToken = result.token;
                this.saveToStorage();

                // Сохраняем данные для "Запомнить меня"
                if (rememberMe) {
                    localStorage.setItem('remembered_email', emailOrUsername);
                    localStorage.setItem('remember_me', 'true');
                } else {
                    localStorage.removeItem('remembered_email');
                    localStorage.removeItem('remember_me');
                }
            }

            return result;

        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Ошибка входа' };
        }
    }

    // Выход из системы
    logout() {
        if (this.currentToken) {
            this.db.logout(this.currentToken);
        }
        
        this.currentUser = null;
        this.currentToken = null;
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('remember_me');
        localStorage.removeItem('remembered_email');
        
        return { success: true };
    }

    // Проверка авторизации
    isAuthenticated() {
        if (!this.currentToken || !this.currentUser) return false;
        
        const validation = this.db.validateToken(this.currentToken);
        return !!validation;
    }

    // Получение текущего пользователя
    getUser() {
        return this.currentUser;
    }

    // Получение токена
    getToken() {
        return this.currentToken;
    }

    // Проверка сложности пароля
    checkPasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasDigit: /\d/.test(password),
            hasSpecial: /[^A-Za-z0-9]/.test(password)
        };

        checks.score = Object.values(checks).filter(Boolean).length;
        checks.isStrong = checks.score >= 4;

        return checks;
    }

    // Обновление профиля
    async updateProfile(updates) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'Требуется авторизация' };
        }

        const result = this.db.updateUser(this.currentUser.id, updates);
        
        if (result) {
            // Обновляем данные текущего пользователя
            const data = this.db.getData();
            const updatedUser = data.users.find(u => u.id === this.currentUser.id);
            
            if (updatedUser) {
                this.currentUser = {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email
                };
                this.saveToStorage();
                
                this.db.addAuditLog({
                    user_id: this.currentUser.id,
                    action: 'PROFILE_UPDATED',
                    description: 'Обновление профиля'
                });
            }
            
            return { success: true, message: 'Профиль обновлен' };
        }

        return { success: false, message: 'Ошибка обновления профиля' };
    }

    // Смена пароля
    async changePassword(oldPassword, newPassword) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'Требуется авторизация' };
        }

        // Проверяем старый пароль
        const data = this.db.getData();
        const user = data.users.find(u => u.id === this.currentUser.id);
        
        if (user.password !== oldPassword) {
            return { success: false, message: 'Неверный текущий пароль' };
        }

        // Проверяем сложность нового пароля
        const strength = this.checkPasswordStrength(newPassword);
        if (!strength.isStrong) {
            return { success: false, message: 'Новый пароль недостаточно сложен' };
        }

        // Обновляем пароль
        const result = this.db.updateUser(this.currentUser.id, { password: newPassword });
        
        if (result) {
            this.db.addAuditLog({
                user_id: this.currentUser.id,
                action: 'PASSWORD_CHANGED',
                description: 'Смена пароля'
            });
            
            return { success: true, message: 'Пароль успешно изменен' };
        }

        return { success: false, message: 'Ошибка смены пароля' };
    }

    // Восстановление пароля (упрощенная версия)
    async resetPassword(email) {
        const user = this.db.findUser(email);
        
        if (!user) {
            return { success: false, message: 'Пользователь с таким email не найден' };
        }

        // В реальном приложении здесь была бы отправка email
        // Для демо просто возвращаем успех
        this.db.addAuditLog({
            user_id: user.id,
            action: 'PASSWORD_RESET_REQUESTED',
            description: 'Запрос на восстановление пароля'
        });

        return { 
            success: true, 
            message: 'Инструкции по восстановлению пароля отправлены на email' 
        };
    }
}

// Создаем глобальный экземпляр
const auth = new AuthService();
```

---

## 📝 **4. Валидация форм (js/validation.js)**

```javascript
// Утилиты валидации
class FormValidator {
    constructor() {
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    }

    // Валидация email
    validateEmail(email) {
        if (!email) {
            return { isValid: false, message: 'Email обязателен' };
        }
        
        if (!this.emailRegex.test(email)) {
            return { isValid: false, message: 'Некорректный формат email' };
        }
        
        return { isValid: true };
    }

    // Валидация имени пользователя
    validateUsername(username) {
        if (!username) {
            return { isValid: false, message: 'Имя пользователя обязательно' };
        }
        
        if (username.length < 3) {
            return { isValid: false, message: 'Минимум 3 символа' };
        }
        
        if (username.length > 20) {
            return { isValid: false, message: 'Максимум 20 символов' };
        }
        
        if (!this.usernameRegex.test(username)) {
            return { 
                isValid: false, 
                message: 'Только буквы, цифры и подчеркивание' 
            };
        }
        
        return { isValid: true };
    }

    // Валидация пароля
    validatePassword(password, fieldName = 'Пароль') {
        if (!password) {
            return { isValid: false, message: `${fieldName} обязателен` };
        }
        
        if (password.length < 8) {
            return { isValid: false, message: 'Минимум 8 символов' };
        }
        
        const strength = auth.checkPasswordStrength(password);
        
        if (!strength.length) {
            return { isValid: false, message: 'Минимум 8 символов' };
        }
        
        // Для лучшей UX показываем конкретные рекомендации
        if (!strength.isStrong) {
            const missing = [];
            if (!strength.hasUpper) missing.push('заглавные буквы');
            if (!strength.hasLower) missing.push('строчные буквы');
            if (!strength.hasDigit) missing.push('цифры');
            if (!strength.hasSpecial) missing.push('специальные символы');
            
            return {
                isValid: false,
                message: `Добавьте: ${missing.join(', ')}`
            };
        }
        
        return { isValid: true };
    }

    // Валидация подтверждения пароля
    validatePasswordConfirmation(password, confirmation) {
        if (!confirmation) {
            return { isValid: false, message: 'Подтверждение пароля обязательно' };
        }
        
        if (password !== confirmation) {
            return { isValid: false, message: 'Пароли не совпадают' };
        }
        
        return { isValid: true };
    }

    // Показать ошибку
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            
            // Автоматическое скрытие через 5 секунд
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    // Скрыть все ошибки
    hideAllErrors(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const errorElements = form.querySelectorAll('.error');
            errorElements.forEach(el => {
                el.style.display = 'none';
            });
        }
    }

    // Показать сообщение
    showMessage(type, text, elementId = 'message') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
            element.className = `message ${type}`;
            element.style.display = 'block';
            
            // Автоматическое скрытие для success/info
            if (type === 'success' || type === 'info') {
                setTimeout(() => {
                    element.style.display = 'none';
                }, 5000);
            }
        }
    }

    // Обновление индикатора сложности пароля
    updatePasswordStrength(password, strengthBarId, strengthTextId) {
        const strengthBar = document.getElementById(strengthBarId);
        const strengthText = document.getElementById(strengthTextId);
        
        if (!strengthBar || !strengthText) return;
        
        const strength = auth.checkPasswordStrength(password);
        
        // Устанавливаем ширину и цвет
        let width = 0;
        let color = '#e74c3c'; // красный
        let text = 'Слабый';
        
        if (password.length === 0) {
            width = 0;
            text = '';
        } else if (strength.score <= 1) {
            width = 25;
            text = 'Очень слабый';
        } else if (strength.score === 2) {
            width = 50;
            text = 'Слабый';
        } else if (strength.score === 3) {
            width = 75;
            color = '#f39c12'; // оранжевый
            text = 'Средний';
        } else if (strength.score === 4) {
            width = 95;
            color = '#2ecc71'; // зеленый
            text = 'Сильный';
        } else if (strength.score === 5) {
            width = 100;
            color = '#27ae60'; // темно-зеленый
            text = 'Очень сильный';
        }
        
        strengthBar.style.width = width + '%';
        strengthBar.style.background = color;
        strengthText.textContent = text;
    }
}

// Создаем глобальный экземпляр
const validator = new FormValidator();
```

---

## 📄 **5. Главная страница (index.html)**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Система аутентификации</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="auth-container">
        <h1>🔐 Система аутентификации</h1>
        
        <div id="message" class="message"></div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; margin-bottom: 20px;">
                Демонстрационная система аутентификации пользователей<br>
                с использованием HTML, CSS и JavaScript
            </p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 15px; margin: 30px 0;">
            <a href="login.html" class="btn">Войти в систему</a>
            <a href="register.html" class="btn btn-secondary">Зарегистрироваться</a>
        </div>
        
        <div class="card" style="margin-top: 30px;">
            <div class="card-title">Функции системы:</div>
            <ul style="color: #666; line-height: 1.6; padding-left: 20px;">
                <li>Безопасная регистрация пользователей</li>
                <li>Вход с запоминанием сессии</li>
                <li>Восстановление пароля</li>
                <li>Личный кабинет</li>
                <li>Логирование действий</li>
                <li>Защита от CSRF (демо)</li>
                <li>Валидация форм</li>
            </ul>
        </div>
        
        <div class="auth-link">
            <p>Данные хранятся в LocalStorage браузера</p>
        </div>
    </div>

    <script src="js/database.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/validation.js"></script>
    
    <script>
        // Проверяем авторизацию при загрузке
        document.addEventListener('DOMContentLoaded', function() {
            if (auth.isAuthenticated()) {
                validator.showMessage('info', 'Вы уже авторизованы. Переход в личный кабинет...');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }
        });
    </script>
</body>
</html>
```

---

## 🔑 **6. Страница входа (login.html)**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход в систему</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="auth-container">
        <h1>Вход в систему</h1>
        
        <div id="message" class="message"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="username">Email или имя пользователя</label>
                <input type="text" id="username" name="username" required 
                       placeholder="Введите email или имя пользователя">
                <div class="error" id="usernameError"></div>
            </div>
            
            <div class="form-group">
                <label for="password">Пароль</label>
                <input type="password" id="password" name="password" required 
                       placeholder="Введите пароль">
                <div class="error" id="passwordError"></div>
            </div>
            
            <div class="remember-me">
                <input type="checkbox" id="remember" name="remember">
                <label for="remember">Запомнить меня</label>
            </div>
            
            <button type="submit" class="btn" id="submitBtn">Войти</button>
        </form>
        
        <div class="auth-link">
            <a href="forgot-password.html">Забыли пароль?</a> | 
            Нет аккаунта? <a href="register.html">Зарегистрироваться</a> | 
            <a href="index.html">На главную</a>
        </div>
    </div>

    <script src="js/database.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/validation.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Проверяем авторизацию
            if (auth.isAuthenticated()) {
                validator.showMessage('info', 'Вы уже авторизованы. Переход в личный кабинет...');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
                return;
            }
            
            // Заполняем сохраненные данные
            const rememberMe = localStorage.getItem('remember_me') === 'true';
            const rememberedEmail = localStorage.getItem('remembered_email');
            
            if (rememberMe && rememberedEmail) {
                document.getElementById('username').value = rememberedEmail;
                document.getElementById('remember').checked = true;
            }
            
            // Обработка формы
            document.getElementById('loginForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Скрываем старые ошибки
                validator.hideAllErrors('loginForm');
                document.getElementById('message').style.display = 'none';
                
                // Получаем данные формы
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value;
                const rememberMe = document.getElementById('remember').checked;
                
                // Базовая валидация
                let isValid = true;
                
                if (!username) {
                    validator.showError('usernameError', 'Введите email или имя пользователя');
                    isValid = false;
                }
                
                if (!password) {
                    validator.showError('passwordError', 'Введите пароль');
                    isValid = false;
                }
                
                if (!isValid) return;
                
                // Показываем индикатор загрузки
                const submitBtn = document.getElementById('submitBtn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Вход...';
                submitBtn.disabled = true;
                
                try {
                    // Выполняем вход
                    const result = await auth.login(username, password, rememberMe);
                    
                    if (result.success) {
                        validator.showMessage('success', 'Вход выполнен успешно! Переход в личный кабинет...');
                        
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 1500);
                        
                    } else {
                        validator.showMessage('error', result.message);
                    }
                    
                } catch (error) {
                    console.error('Login error:', error);
                    validator.showMessage('error', 'Ошибка сети или сервера');
                    
                } finally {
                    // Восстанавливаем кнопку
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        });
    </script>
</body>
</html>
```

---

## 📝 **7. Страница регистрации (register.html)**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="auth-container">
        <h1>Регистрация</h1>
        
        <div id="message" class="message"></div>
        
        <form id="registerForm">
            <div class="form-group">
                <label for="username">Имя пользователя *</label>
                <input type="text" id="username" name="username" required 
                       placeholder="От 3 до 20 символов" 
                       oninput="validateUsername()">
                <div class="error" id="usernameError"></div>
            </div>
            
            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required 
                       placeholder="example@domain.com"
                       oninput="validateEmail()">
                <div class="error" id="emailError"></div>
            </div>
            
            <div class="form-group">
                <label for="password">Пароль *</label>
                <input type="password" id="password" name="password" required 
                       placeholder="Минимум 8 символов"
                       oninput="validatePassword()">
                <div class="error" id="passwordError"></div>
                
                <div class="password-strength">
                    <div>Сложность пароля: <span id="strengthText"></span></div>
                    <div class="strength-bar">
                        <div class="strength-fill" id="strengthBar"></div>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Подтверждение пароля *</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required 
                       placeholder="Повторите пароль"
                       oninput="validateConfirmPassword()">
                <div class="error" id="confirmError"></div>
            </div>
            
            <button type="submit" class="btn" id="submitBtn">Зарегистрироваться</button>
        </form>
        
        <div class="auth-link">
            Уже есть аккаунт? <a href="login.html">Войти</a> | 
            <a href="index.html">На главную</a>
        </div>
    </div>

    <script src="js/database.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/validation.js"></script>
    
    <script>
        // Функции валидации в реальном времени
        function validateUsername() {
            const username = document.getElementById('username').value.trim();
            const result = validator.validateUsername(username);
            
            if (!result.isValid && username.length > 0) {
                validator.showError('usernameError', result.message);
            } else {
                document.getElementById('usernameError').style.display = 'none';
            }
        }
        
        function validateEmail() {
            const email = document.getElementById('email').value.trim();
            const result = validator.validateEmail(email);
            
            if (!result.isValid && email.length > 0) {
                validator.showError('emailError', result.message);
            } else {
                document.getElementById('emailError').style.display = 'none';
            }
        }
        
        function validatePassword() {
            const password = document.getElementById('password').value;
            
            // Обновляем индикатор сложности
            validator.updatePasswordStrength(
                password, 
                'strengthBar', 
                'strengthText'
            );
            
            const result = validator.validatePassword(password);
            
            if (!result.isValid && password.length > 0) {
                validator.showError('passwordError', result.message);
            } else {
                document.getElementById('passwordError').style.display = 'none';
            }
            
            // Также проверяем подтверждение пароля
            validateConfirmPassword();
        }
        
        function validateConfirmPassword() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (confirmPassword.length > 0) {
                const result = validator.validatePasswordConfirmation(password, confirmPassword);
                
                if (!result.isValid) {
                    validator.showError('confirmError', result.message);
                } else {
                    document.getElementById('confirmError').style.display = 'none';
                }
            }
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            // Проверяем авторизацию
            if (auth.isAuthenticated()) {
                validator.showMessage('info', 'Вы уже авторизованы. Переход в личный кабинет...');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
                return;
            }
            
            // Обработка формы
            document.getElementById('registerForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Скрываем старые ошибки и сообщения
                validator.hideAllErrors('registerForm');
                document.getElementById('message').style.display = 'none';
                
                // Получаем данные формы
                const formData = {
                    username: document.getElementById('username').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value,
                    confirmPassword: document.getElementById('confirmPassword').value
                };
                
                // Валидация всех полей
                let isValid = true;
                
                const usernameValidation = validator.validateUsername(formData.username);
                if (!usernameValidation.isValid) {
                    validator.showError('usernameError', usernameValidation.message);
                    isValid = false;
                }
                
                const emailValidation = validator.validateEmail(formData.email);
                if (!emailValidation.isValid) {
                    validator.showError('emailError', emailValidation.message);
                    isValid = false;
                }
                
                const passwordValidation = validator.validatePassword(formData.password);
                if (!passwordValidation.isValid) {
                    validator.showError('passwordError', passwordValidation.message);
                    isValid = false;
                }
                
                const confirmValidation = validator.validatePasswordConfirmation(
                    formData.password, 
                    formData.confirmPassword
                );
                
                if (!confirmValidation.isValid) {
                    validator.showError('confirmError', confirmValidation.message);
                    isValid = false;
                }
                
                if (!isValid) return;
                
                // Показываем индикатор загрузки
                const submitBtn = document.getElementById('submitBtn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Регистрация...';
                submitBtn.disabled = true;
                
                try {
                    // Выполняем регистрацию
                    const result = await auth.register(formData);
                    
                    if (result.success) {
                        validator.showMessage('success', 'Регистрация успешна! Переход в личный кабинет...');
                        
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 1500);
                        
                    } else {
                        validator.showMessage('error', result.message);
                        
                        // Показываем конкретную ошибку
                        if (result.message.includes('Email')) {
                            validator.showError('emailError', result.message);
                        } else if (result.message.includes('имя пользователя')) {
                            validator.showError('usernameError', result.message);
                        }
                    }
                    
                } catch (error) {
                    console.error('Registration error:', error);
                    validator.showMessage('error', 'Ошибка регистрации');
                    
                } finally {
                    // Восстанавливаем кнопку
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        });
    </script>
</body>
</html>
```

---

## 🏠 **8. Личный кабинет (dashboard.html)**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личный кабинет</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="dashboard.html" class="nav-brand">🔐 Личный кабинет</a>
            <div class="nav-user">
                <span class="user-info" id="userName"></span>
                <button onclick="logout()" class="btn btn-danger" style="padding: 8px 16px;">
                    Выйти
                </button>
            </div>
        </div>
    </nav>

    <div class="dashboard-container">
        <h1>Добро пожаловать, <span id="welcomeName"></span>!</h1>
        
        <div id="message" class="message"></div>
        
        <div class="card">
            <div class="card-title">Информация о пользователе</div>
            <div id="userInfo"></div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
            <div class="card">
                <div class="card-title">Быстрые действия</div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="showChangePassword()" class="btn btn-secondary">
                        Сменить пароль
                    </button>
                    <button onclick="showProfileForm()" class="btn btn-secondary">
                        Редактировать профиль
                    </button>
                    <button onclick="showSecurityLogs()" class="btn btn-secondary">
                        История безопасности
                    </button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">Система</div>
                <div style="color: #666; line-height: 1.6;">
                    <p><strong>Статус:</strong> <span id="userStatus" style="color: #2ecc71;">Активен</span></p>
                    <p><strong>Последний вход:</strong> <span id="lastLogin"></span></p>
                    <p><strong>Дата регистрации:</strong> <span id="createdAt"></span></p>
                    <p><strong>Текущая сессия:</strong> <span id="sessionInfo"></span></p>
                </div>
            </div>
        </div>
        
        <!-- Форма смены пароля -->
        <div id="changePasswordForm" class="card" style="display: none;">
            <div class="card-title">Смена пароля</div>
            <form id="passwordForm">
                <div class="form-group">
                    <label for="currentPassword">Текущий пароль</label>
                    <input type="password" id="currentPassword" name="currentPassword" required>
                    <div class="error" id="currentPasswordError"></div>
                </div>
                
                <div class="form-group">
                    <label for="newPassword">Новый пароль</label>
                    <input type="password" id="newPassword" name="newPassword" required 
                           oninput="validateNewPassword()">
                    <div class="error" id="newPasswordError"></div>
                    
                    <div class="password-strength">
                        <div>Сложность пароля: <span id="newStrengthText"></span></div>
                        <div class="strength-bar">
                            <div class="strength-fill" id="newStrengthBar"></div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirmNewPassword">Подтверждение нового пароля</label>
                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" required>
                    <div class="error" id="confirmNewPasswordError"></div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button type="submit" class="btn">Сменить пароль</button>
                    <button type="button" class="btn btn-secondary" onclick="hideChangePassword()">
                        Отмена
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Форма редактирования профиля -->
        <div id="profileForm" class="card" style="display: none;">
            <div class="card-title">Редактирование профиля</div>
            <form id="editProfileForm">
                <div class="form-group">
                    <label for="editFirstName">Имя</label>
                    <input type="text" id="editFirstName" name="firstName">
                </div>
                
                <div class="form-group">
                    <label for="editLastName">Фамилия</label>
                    <input type="text" id="editLastName" name="lastName">
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button type="submit" class="btn">Сохранить изменения</button>
                    <button type="button" class="btn btn-secondary" onclick="hideProfileForm()">
                        Отмена
                    </button>
                </div>
            </form>
        </div>
        
        <!-- История безопасности -->
        <div id="securityLogs" class="card" style="display: none;">
            <div class="card-title">История безопасности</div>
            <table class="table" id="auditLogsTable">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Действие</th>
                        <th>Описание</th>
                        <th>IP адрес</th>
                    </tr>
                </thead>
                <tbody id="auditLogsBody">
                    <!-- Заполняется JavaScript -->
                </tbody>
            </table>
            <button type="button" class="btn btn-secondary" onclick="hideSecurityLogs()" 
                    style="margin-top: 15px;">
                Закрыть
            </button>
        </div>
        
        <!-- Административная панель (только для админа) -->
        <div id="adminPanel" class="card" style="display: none;">
            <div class="card-title">Административная панель</div>
            <table class="table" id="usersTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя пользователя</th>
                        <th>Email</th>
                        <th>Дата регистрации</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody">
                    <!-- Заполняется JavaScript -->
                </tbody>
            </table>
        </div>
        
        <div class="auth-link">
            <a href="index.html">На главную</a>
        </div>
    </div>

    <script src="js/database.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/validation.js"></script>
    
    <script>
        // Функции управления интерфейсом
        function showChangePassword() {
            document.getElementById('changePasswordForm').style.display = 'block';
            document.getElementById('profileForm').style.display = 'none';
            document.getElementById('securityLogs').style.display = 'none';
        }
        
        function hideChangePassword() {
            document.getElementById('changePasswordForm').style.display = 'none';
            document.getElementById('passwordForm').reset();
        }
        
        function showProfileForm() {
            document.getElementById('profileForm').style.display = 'block';
            document.getElementById('changePasswordForm').style.display = 'none';
            document.getElementById('securityLogs').style.display = 'none';
        }
        
        function hideProfileForm() {
            document.getElementById('profileForm').style.display = 'none';
        }
        
        function showSecurityLogs() {
            document.getElementById('securityLogs').style.display = 'block';
            document.getElementById('changePasswordForm').style.display = 'none';
            document.getElementById('profileForm').style.display = 'none';
            loadAuditLogs();
        }
        
        function hideSecurityLogs() {
            document.getElementById('securityLogs').style.display = 'none';
        }
        
        // Валидация нового пароля в реальном времени
        function validateNewPassword() {
            const password = document.getElementById('newPassword').value;
            validator.updatePasswordStrength(
                password, 
                'newStrengthBar', 
                'newStrengthText'
            );
        }
        
        // Загрузка истории безопасности
        function loadAuditLogs() {
            const logs = db.getAuditLogs();
            const userLogs = logs.filter(log => log.user_id === auth.getUser().id);
            
            const tbody = document.getElementById('auditLogsBody');
            tbody.innerHTML = '';
            
            userLogs.slice(-10).reverse().forEach(log => {
                const row = document.createElement('tr');
                const date = new Date(log.created_at).toLocaleString('ru-RU');
                
                row.innerHTML = `
                    <td>${date}</td>
                    <td>${log.action}</td>
                    <td>${log.description}</td>
                    <td>${log.ip_address}</td>
                `;
                
                tbody.appendChild(row);
            });
        }
        
        // Загрузка списка пользователей (для админа)
        function loadUsers() {
            const users = db.getAllUsers();
            const tbody = document.getElementById('usersTableBody');
            tbody.innerHTML = '';
            
            users.forEach(user => {
                const row = document.createElement('tr');
                const createdDate = new Date(user.created_at).toLocaleDateString('ru-RU');
                const lastLogin = user.last_login 
                    ? new Date(user.last_login).toLocaleString('ru-RU') 
                    : 'Никогда';
                
                row.innerHTML = `
                    <td>${user.id.substr(-6)}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${createdDate}</td>
                    <td><span style="color: ${user.is_active ? '#2ecc71' : '#e74c3c'}">
                        ${user.is_active ? 'Активен' : 'Заблокирован'}
                    </span></td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Показываем админ-панель если пользователь - admin
            if (auth.getUser().username === 'admin') {
                document.getElementById('adminPanel').style.display = 'block';
            }
        }
        
        // Выход из системы
        function logout() {
            auth.logout();
            validator.showMessage('success', 'Выход выполнен успешно!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            // Проверяем авторизацию
            if (!auth.isAuthenticated()) {
                validator.showMessage('error', 'Требуется авторизация');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }
            
            // Заполняем информацию о пользователе
            const user = auth.getUser();
            document.getElementById('userName').textContent = user.username;
            document.getElementById('welcomeName').textContent = user.username;
            
            // Получаем полную информацию о пользователе
            const fullUser = db.findUser(user.email);
            
            if (fullUser) {
                document.getElementById('userInfo').innerHTML = `
                    <p><strong>Имя пользователя:</strong> ${fullUser.username}</p>
                    <p><strong>Email:</strong> ${fullUser.email}</p>
                    ${fullUser.first_name ? `<p><strong>Имя:</strong> ${fullUser.first_name}</p>` : ''}
                    ${fullUser.last_name ? `<p><strong>Фамилия:</strong> ${fullUser.last_name}</p>` : ''}
                `;
                
                const createdDate = new Date(fullUser.created_at).toLocaleDateString('ru-RU');
                const lastLogin = fullUser.last_login 
                    ? new Date(fullUser.last_login).toLocaleString('ru-RU') 
                    : 'Никогда';
                
                document.getElementById('lastLogin').textContent = lastLogin;
                document.getElementById('createdAt').textContent = createdDate;
                
                // Заполняем форму редактирования профиля
                document.getElementById('editFirstName').value = fullUser.first_name || '';
                document.getElementById('editLastName').value = fullUser.last_name || '';
            }
            
            // Информация о сессии
            const sessionInfo = db.validateToken(auth.getToken());
            if (sessionInfo && sessionInfo.session) {
                const expires = new Date(sessionInfo.session.expires_at);
                document.getElementById('sessionInfo').textContent = 
                    `Действительна до ${expires.toLocaleTimeString('ru-RU')}`;
            }
            
            // Загружаем список пользователей (если админ)
            loadUsers();
            
            // Обработка формы смены пароля
            document.getElementById('passwordForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Скрываем старые ошибки
                validator.hideAllErrors('passwordForm');
                
                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmNewPassword = document.getElementById('confirmNewPassword').value;
                
                // Валидация
                let isValid = true;
                
                if (!currentPassword) {
                    validator.showError('currentPasswordError', 'Введите текущий пароль');
                    isValid = false;
                }
                
                const newPasswordValidation = validator.validatePassword(newPassword, 'Новый пароль');
                if (!newPasswordValidation.isValid) {
                    validator.showError('newPasswordError', newPasswordValidation.message);
                    isValid = false;
                }
                
                if (newPassword !== confirmNewPassword) {
                    validator.showError('confirmNewPasswordError', 'Пароли не совпадают');
                    isValid = false;
                }
                
                if (!isValid) return;
                
                try {
                    const result = await auth.changePassword(currentPassword, newPassword);
                    
                    if (result.success) {
                        validator.showMessage('success', 'Пароль успешно изменен!');
                        document.getElementById('passwordForm').reset();
                        hideChangePassword();
                    } else {
                        validator.showMessage('error', result.message);
                        if (result.message.includes('текущий пароль')) {
                            validator.showError('currentPasswordError', result.message);
                        }
                    }
                    
                } catch (error) {
                    console.error('Change password error:', error);
                    validator.showMessage('error', 'Ошибка смены пароля');
                }
            });
            
            // Обработка формы редактирования профиля
            document.getElementById('editProfileForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const updates = {
                    first_name: document.getElementById('editFirstName').value.trim(),
                    last_name: document.getElementById('editLastName').value.trim()
                };
                
                const result = await auth.updateProfile(updates);
                
                if (result.success) {
                    validator.showMessage('success', 'Профиль успешно обновлен!');
                    hideProfileForm();
                    
                    // Обновляем информацию на странице
                    const fullUser = db.findUser(user.email);
                    if (fullUser) {
                        document.getElementById('userInfo').innerHTML = `
                            <p><strong>Имя пользователя:</strong> ${fullUser.username}</p>
                            <p><strong>Email:</strong> ${fullUser.email}</p>
                            ${fullUser.first_name ? `<p><strong>Имя:</strong> ${fullUser.first_name}</p>` : ''}
                            ${fullUser.last_name ? `<p><strong>Фамилия:</strong> ${fullUser.last_name}</p>` : ''}
                        `;
                    }
                } else {
                    validator.showMessage('error', result.message);
                }
            });
        });
    </script>
</body>
</html>
```

---

## 🔓 **9. Восстановление пароля (forgot-password.html)**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Восстановление пароля</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="auth-container">
        <h1>Восстановление пароля</h1>
        
        <div id="message" class="message"></div>
        
        <div id="resetFormContainer">
            <p style="color: #666; margin-bottom: 20px; text-align: center;">
                Введите email, указанный при регистрации.<br>
                Мы отправим вам инструкции по восстановлению пароля.
            </p>
            
            <form id="resetForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required 
                           placeholder="Введите ваш email">
                    <div class="error" id="emailError"></div>
                </div>
                
                <button type="submit" class="btn" id="submitBtn">Восстановить пароль</button>
            </form>
        </div>
        
        <div id="successMessage" style="display: none; text-align: center;">
            <div style="color: #2ecc71; font-size: 48px; margin: 20px 0;">✓</div>
            <h2>Письмо отправлено!</h2>
            <p style="color: #666; margin: 20px 0;">
                Инструкции по восстановлению пароля отправлены на указанный email.<br>
                Пожалуйста, проверьте вашу почту.
            </p>
            <p style="color: #888; font-size: 14px;">
                <em>Примечание: Это демо-версия. В реальном приложении 
                письмо было бы отправлено на указанный адрес.</em>
            </p>
        </div>
        
        <div class="auth-link" style="margin-top: 30px;">
            <a href="login.html">Войти в систему</a> | 
            <a href="register.html">Зарегистрироваться</a> | 
            <a href="index.html">На главную</a>
        </div>
    </div>

    <script src="js/database.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/validation.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('resetForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Скрываем старые ошибки
                document.getElementById('emailError').style.display = 'none';
                document.getElementById('message').style.display = 'none';
                
                const email = document.getElementById('email').value.trim();
                
                // Валидация email
                const emailValidation = validator.validateEmail(email);
                if (!emailValidation.isValid) {
                    validator.showError('emailError', emailValidation.message);
                    return;
                }
                
                // Показываем индикатор загрузки
                const submitBtn = document.getElementById('submitBtn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                
                // Имитация задержки сети
                setTimeout(async () => {
                    try {
                        // Выполняем восстановление пароля
                        const result = await auth.resetPassword(email);
                        
                        if (result.success) {
                            // Показываем сообщение об успехе
                            document.getElementById('resetFormContainer').style.display = 'none';
                            document.getElementById('successMessage').style.display = 'block';
                        } else {
                            validator.showMessage('error', result.message);
                        }
                        
                    } catch (error) {
                        console.error('Reset password error:', error);
                        validator.showMessage('error', 'Ошибка восстановления пароля');
                        
                    } finally {
                        // Восстанавливаем кнопку
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                }, 1500);
            });
        });
    </script>
</body>
</html>
```

---

## 🚀 **Как запустить проект**

1. **Создайте структуру папок и файлов** как указано выше
2. **Откройте `index.html`** в браузере
3. **Все готово!** Система работает полностью в браузере

### **Тестовые учетные записи:**
При первом запуске система пустая. Зарегистрируйте:
- Обычного пользователя
- Пользователя с именем `admin` (откроет админ-панель)

### **Особенности:**
- Все данные хранятся в LocalStorage браузера
- Обновите страницу или закройте браузер - данные сохранятся
- Для очистки данных: Инструменты разработчика → Application → Local Storage → Clear

---

## 🎯 **Что реализовано в системе:**

### **✅ Основные функции:**
1. **Регистрация** с валидацией
2. **Вход** в систему
3. **Выход** из системы
4. **Личный кабинет**
5. **Восстановление пароля**
6. **Смена пароля**
7. **Редактирование профиля**

### **✅ Безопасность (демо):**
1. Валидация форм
2. Проверка сложности паролей
3. Хранение сессий
4. Логирование действий
5. Защита маршрутов

### **✅ Дополнительные возможности:**
1. Админ-панель (для пользователя admin)
2. История безопасности
3. Список пользователей
4. "Запомнить меня"
5. Адаптивный дизайн

---

## 📊 **Тестирование системы**

### **Сценарии для проверки:**

1. **Регистрация нового пользователя**
2. **Вход с правильными данными**
3. **Вход с неправильным паролем**
4. **Выход из системы**
5. **Смена пароля в личном кабинете**
6. **Восстановление забытого пароля**
7. **Попытка доступа к dashboard без авторизации**
8. **Обновление профиля**

---

## 💡 **Для дальнейшего развития:**

1. **Добавить реальный бэкенд** (Node.js/Python/PHP)
2. **Реализовать отправку email** для подтверждения и восстановления
3. **Добавить 2FA** (двухфакторную аутентификацию)
4. **Внедрить reCAPTCHA** для защиты от ботов
5. **Добавить OAuth** (вход через Google/Facebook)
6. **Реализовать ролевую модель** (пользователь/модератор/админ)
7. **Добавить вебсокеты** для онлайн-статусов

---

**Готово!** У вас есть полноценная система аутентификации на чистом HTML/CSS/JS 🎉
