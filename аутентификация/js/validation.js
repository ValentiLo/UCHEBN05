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