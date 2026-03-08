
## Практическая работа: "Интернет-магазин на React"

### 📋 Цель работы
Создать базовый интернет-магазин с каталогом товаров, корзиной и страницей пользователей.

### 🔧 Предварительные требования
- Установлен Node.js и npm
- Базовое понимание React компонентов и хуков
- Текстовый редактор (VS Code рекомендуется)

### 📁 Структура проекта

```
internet-shop/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Cart.jsx
│   │   └── CartItem.jsx
│   ├── pages/
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Users.jsx
│   │   └── CartPage.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

### 📦 Шаг 1: Создание проекта и установка зависимостей

```bash
# Создаем проект
npm create vite@latest internet-shop -- --template react
cd internet-shop

# Устанавливаем React Router (решение вашей ошибки!)
npm install react-router-dom

# Запускаем проект
npm run dev
```

### 🔧 Шаг 2: Создание файла с данными

**`src/data/mockData.js`**
```javascript
// Товары для интернет-магазина
export const products = [
  {
    id: 1,
    name: 'Ноутбук ASUS',
    price: 75000,
    category: 'Электроника',
    description: 'Мощный ноутбук для работы и игр',
    image: 'https://via.placeholder.com/300x200?text=Ноутбук'
  },
  {
    id: 2,
    name: 'Смартфон Samsung',
    price: 45000,
    category: 'Электроника',
    description: 'Современный смартфон с отличной камерой',
    image: 'https://via.placeholder.com/300x200?text=Смартфон'
  },
  {
    id: 3,
    name: 'Наушники Sony',
    price: 8000,
    category: 'Аксессуары',
    description: 'Беспроводные наушники с шумоподавлением',
    image: 'https://via.placeholder.com/300x200?text=Наушники'
  },
  {
    id: 4,
    name: 'Кофемашина DeLonghi',
    price: 35000,
    category: 'Для дома',
    description: 'Автоматическая кофемашина для идеального эспрессо',
    image: 'https://via.placeholder.com/300x200?text=Кофемашина'
  },
  {
    id: 5,
    name: 'Книга "React для начинающих"',
    price: 1500,
    category: 'Книги',
    description: 'Изучите React с нуля',
    image: 'https://via.placeholder.com/300x200?text=Книга'
  }
];

// Пользователи
export const users = [
  { id: 1, name: 'Иван Петров', email: 'ivan@mail.ru', orders: 5 },
  { id: 2, name: 'Мария Смирнова', email: 'maria@mail.ru', orders: 12 },
  { id: 3, name: 'Алексей Иванов', email: 'alex@mail.ru', orders: 3 }
];
```

### 🧩 Шаг 3: Создание компонентов

**`src/components/Header.jsx`**
```jsx
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ cartItemsCount }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>
        🛒 Интернет-магазин
      </div>
      
      <nav className="nav">
        <Link to="/" className="nav-link">Товары</Link>
        <Link to="/users" className="nav-link">Пользователи</Link>
        <Link to="/cart" className="nav-link cart-link">
          🛍️ Корзина 
          {cartItemsCount > 0 && (
            <span className="cart-badge">{cartItemsCount}</span>
          )}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
```

**`src/components/Header.css`**
```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #3498db;
}

.cart-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-badge {
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
}
```

**`src/components/ProductCard.jsx`**
```jsx
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">{product.price.toLocaleString()} ₽</p>
        <p className="product-description">{product.description}</p>
        <div className="product-actions">
          <button 
            className="details-btn"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            Подробнее
          </button>
          <button 
            className="cart-btn"
            onClick={() => onAddToCart(product)}
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
```

**`src/components/ProductCard.css`**
```css
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-name {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.product-category {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.5rem;
}

.product-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.product-description {
  color: #777;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.details-btn, .cart-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.details-btn {
  background-color: #3498db;
  color: white;
}

.details-btn:hover {
  background-color: #2980b9;
}

.cart-btn {
  background-color: #27ae60;
  color: white;
}

.cart-btn:hover {
  background-color: #219a52;
}
```

### 📄 Шаг 4: Создание страниц

**`src/pages/Products.jsx`** (главная страница с товарами)
```jsx
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';
import './Products.css';

function Products({ addToCart }) {
  const [filter, setFilter] = useState('all');
  
  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="products-page">
      <h1>Каталог товаров</h1>
      
      <div className="filters">
        <label>Категория: </label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Все' : cat}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default Products;
```

**`src/pages/Products.css`**
```css
.products-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.products-page h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.filters {
  margin-bottom: 2rem;
  text-align: right;
}

.filter-select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 0.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
```

**`src/pages/ProductDetails.jsx`**
```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mockData';
import './ProductDetails.css';

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="not-found">
        <h2>Товар не найден</h2>
        <button onClick={() => navigate('/')}>Вернуться к каталогу</button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Назад
      </button>
      
      <div className="details-container">
        <img src={product.image} alt={product.name} />
        
        <div className="details-info">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <p className="price">{product.price.toLocaleString()} ₽</p>
          <p className="description">{product.description}</p>
          
          <button 
            className="add-to-cart"
            onClick={() => {
              addToCart(product);
              alert('Товар добавлен в корзину!');
            }}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
```

**`src/pages/ProductDetails.css`**
```css
.product-details {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.back-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 2rem;
}

.details-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.details-container img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.details-info {
  padding: 2rem;
}

.category {
  color: #666;
  font-size: 1rem;
  margin: 0.5rem 0;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 1rem 0;
}

.description {
  line-height: 1.6;
  color: #555;
  margin: 1.5rem 0;
}

.add-to-cart {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart:hover {
  background-color: #219a52;
}

.not-found {
  text-align: center;
  padding: 3rem;
}

.not-found button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
```

**`src/pages/Users.jsx`**
```jsx
import { users } from '../data/mockData';
import './Users.css';

function Users() {
  return (
    <div className="users-page">
      <h1>Наши покупатели</h1>
      
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Заказов: {user.orders}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
```

**`src/pages/Users.css`**
```css
.users-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.users-page h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.user-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.user-card h3 {
  margin: 0 0 1rem;
  color: #2c3e50;
}

.user-card p {
  margin: 0.5rem 0;
  color: #666;
}
```

**`src/pages/CartPage.jsx`**
```jsx
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

function CartPage({ cart, removeFromCart }) {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
        <button onClick={() => navigate('/')}>Перейти к покупкам</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>
      
      <div className="cart-items">
        {cart.map((item, index) => (
          <div key={`${item.id}-${index}`} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <p className="item-price">{item.price.toLocaleString()} ₽</p>
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="total">
          <h2>Итого:</h2>
          <p className="total-price">{total.toLocaleString()} ₽</p>
        </div>
        <button className="checkout-btn">Оформить заказ</button>
      </div>
    </div>
  );
}

export default CartPage;
```

**`src/pages/CartPage.css`**
```css
.cart-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.cart-page h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  align-items: center;
}

.cart-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info h3 {
  margin: 0 0 0.5rem;
  color: #333;
}

.item-info p {
  margin: 0.2rem 0;
  color: #666;
}

.item-price {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2rem;
}

.remove-btn {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background-color: #c0392b;
}

.cart-summary {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
}

.total h2 {
  margin: 0;
  color: #333;
}

.total-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #27ae60;
  margin: 0;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #219a52;
}

.empty-cart {
  text-align: center;
  padding: 4rem;
}

.empty-cart button {
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
}
```

### 🎯 Шаг 5: Финальная сборка App.jsx

**`src/App.jsx`**
```jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Users from './pages/Users';
import CartPage from './pages/CartPage';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Header cartItemsCount={cart.length} />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<Products addToCart={addToCart} />} 
            />
            <Route 
              path="/product/:id" 
              element={<ProductDetails addToCart={addToCart} />} 
            />
            <Route path="/users" element={<Users />} />
            <Route 
              path="/cart" 
              element={
                <CartPage 
                  cart={cart} 
                  removeFromCart={removeFromCart} 
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

**`src/App.css`**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: #f5f6fa;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
}
```

**`src/main.jsx`**
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### ✅ Шаг 6: Проверка работы

Запустите проект:
```bash
npm run dev
```

Откройте `http://localhost:5173` и проверьте:
- ✅ Отображение всех товаров
- ✅ Фильтрация по категориям
- ✅ Переход на детальную страницу товара
- ✅ Добавление в корзину
- ✅ Просмотр корзины и удаление товаров
- ✅ Страница пользователей
- ✅ Счетчик товаров в корзине в шапке

### 📝 Задания для самостоятельной работы

1. **Базовый уровень**: Добавьте возможность изменять количество товара в корзине
2. **Средний уровень**: Реализуйте поиск товаров по названию
3. **Продвинутый уровень**: Добавьте сохранение корзины в localStorage
4. **Экспертный уровень**: Реализуйте страницу оформления заказа с формой

### 🎨 Пример результата

После выполнения всех шагов у вас получится полноценный интернет-магазин с:
- Каталогом товаров
- Фильтрацией по категориям
- Детальной страницей каждого товара
- Корзиной покупок
- Списком пользователей
- Навигацией между страницами

