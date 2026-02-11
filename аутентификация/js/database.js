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