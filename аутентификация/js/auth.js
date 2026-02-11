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