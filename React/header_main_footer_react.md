Пример реализации типовой структуры страницы с компонентами `Header`, `Main` и `Footer` на React.

## Базовая структура

### 1. Компонент Header (Шапка)

```jsx
// components/Header.jsx
import React from 'react';
import './Header.css'; // опционально

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/">Мой Сайт</a>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li><a href="/">Главная</a></li>
            <li><a href="/about">О нас</a></li>
            <li><a href="/services">Услуги</a></li>
            <li><a href="/contacts">Контакты</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="btn btn-login">Войти</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### 2. Компонент Main (Основной контент)

```jsx
// components/Main.jsx
import React from 'react';
import './Main.css';

const Main = () => {
  return (
    <main className="main-content">
      <div className="container">
        <section className="hero">
          <h1>Добро пожаловать на наш сайт!</h1>
          <p>Это пример страницы с компонентами Header, Main и Footer.</p>
          <button className="btn btn-primary">Узнать больше</button>
        </section>

        <section className="features">
          <h2>Наши преимущества</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Преимущество 1</h3>
              <p>Описание первого преимущества</p>
            </div>
            <div className="feature-card">
              <h3>Преимущество 2</h3>
              <p>Описание второго преимущества</p>
            </div>
            <div className="feature-card">
              <h3>Преимущество 3</h3>
              <p>Описание третьего преимущества</p>
            </div>
          </div>
        </section>

        <section className="content">
          <h2>Основной контент</h2>
          <p>Здесь может быть любой контент вашей страницы.</p>
        </section>
      </div>
    </main>
  );
};

export default Main;
```

### 3. Компонент Footer (Подвал)

```jsx
// components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>О компании</h4>
          <p>Краткое описание компании или проекта</p>
        </div>
        
        <div className="footer-section">
          <h4>Навигация</h4>
          <ul className="footer-links">
            <li><a href="/">Главная</a></li>
            <li><a href="/about">О нас</a></li>
            <li><a href="/services">Услуги</a></li>
            <li><a href="/contacts">Контакты</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Контакты</h4>
          <ul className="footer-contact">
            <li>Email: info@example.com</li>
            <li>Тел: +7 (999) 123-45-67</li>
            <li>Адрес: г. Москва, ул. Примерная, д. 1</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Соцсети</h4>
          <div className="social-links">
            <a href="#" aria-label="VK">VK</a>
            <a href="#" aria-label="Telegram">TG</a>
            <a href="#" aria-label="YouTube">YT</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Мой Сайт. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
```

### 4. Сборка всего вместе (App.jsx)

```jsx
// App.jsx
import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
```

## Продвинутый вариант с пропсами

Если вы хотите передавать данные в компоненты:

### Header с пропсами

```jsx
// components/Header.jsx (улучшенная версия)
import React from 'react';

const Header = ({ siteName = 'Мой Сайт', menuItems = [] }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/">{siteName}</a>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href={item.path}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

### App.jsx с передачей данных

```jsx
// App.jsx
import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

function App() {
  const menuItems = [
    { path: '/', label: 'Главная' },
    { path: '/about', label: 'О нас' },
    { path: '/services', label: 'Услуги' },
    { path: '/contacts', label: 'Контакты' },
  ];

  const footerSections = [
    {
      title: 'О компании',
      content: 'Краткое описание компании'
    },
    {
      title: 'Контакты',
      content: 'info@example.com'
    }
  ];

  return (
    <div className="app">
      <Header siteName="Мой Сайт" menuItems={menuItems} />
      <Main />
      <Footer sections={footerSections} />
    </div>
  );
}

export default App;
```

## Базовая стилизация (App.css)

```css
/* App.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header стили */
.header {
  background-color: #333;
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-list a {
  color: white;
  text-decoration: none;
}

.nav-list a:hover {
  color: #ddd;
}

/* Main стили */
.main-content {
  flex: 1;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  text-align: center;
  padding: 3rem 0;
  background-color: #f5f5f5;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.feature-card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* Footer стили */
.footer {
  background-color: #333;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h4 {
  margin-bottom: 1rem;
}

.footer-links,
.footer-contact {
  list-style: none;
}

.footer-links a,
.footer-contact li {
  color: #ddd;
  text-decoration: none;
  margin-bottom: 0.5rem;
  display: block;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #555;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}
```

## Структура проекта

```
my-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Main.jsx
│   │   ├── Main.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── public/
└── package.json
```

Такая структура обеспечивает чистую архитектуру, где каждый компонент отвечает за свою часть страницы, их легко поддерживать и переиспользовать.
