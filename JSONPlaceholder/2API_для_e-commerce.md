Для имитации интернет-магазина бытовой техники рекомендую следующие варианты, от простых к сложным:

## 🛒 **Готовые фейковые API для e-commerce:**

### 1. **FakeStore API** — лучший готовый вариант
```
https://fakerapi.it/api/v1/products
https://fakestoreapi.com/products
```
- ✅ Уже есть категории электроники (`electronics`)
- ✅ Реалистичные данные (цены, описания, рейтинги)
- ✅ Готовые эндпоинты для корзины, пользователей
- Пример: `GET https://fakestoreapi.com/products/category/electronics`

### 2. **DummyJSON** — самый полный
```
https://dummyjson.com/products/category/smartphones
https://dummyjson.com/products/category/laptops
```
- ✅ 100+ товаров с изображениями
- ✅ Поиск, фильтрация, пагинация
- ✅ Категории: smartphones, laptops, home-decoration, lighting
- ✅ Есть скидки, рейтинги, отзывы

---

## 🛠 **Создание своего мока:**

### **1. Быстрое решение: JSON Server**
```bash
npm install -g json-server
```
Создайте файл `db.json`:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Холодильник Samsung",
      "category": "Крупная техника",
      "price": 45999,
      "rating": 4.5,
      "inStock": true,
      "image": "https://via.placeholder.com/300"
    },
    {
      "id": 2,
      "name": "Робот-пылесос Xiaomi",
      "category": "Малая техника",
      "price": 24999,
      "rating": 4.2
    }
  ],
  "categories": [
    {"id": 1, "name": "Крупная техника"},
    {"id": 2, "name": "Малая техника"},
    {"id": 3, "name": "Встраиваемая техника"}
  ],
  "orders": []
}
```
Запустите:
```bash
json-server --watch db.json --port 3001
```
**Преимущества:**
- Полный CRUD (данные сохраняются локально)
- Фильтрация: `/products?category=Крупная+техника&price_gte=20000`
- Сортировка: `/products?_sort=price&_order=desc`

### **2. Более продвинуто: MSW (Mock Service Worker)**
```javascript
// mocks/handlers.js
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/products', (req, res, ctx) => {
    const category = req.url.searchParams.get('category')
    return res(
      ctx.json([
        {
          id: 1,
          name: 'Стиральная машина LG',
          price: 34999,
          category: 'Крупная техника',
          specs: {
            capacity: '7 кг',
            energyClass: 'A++'
          }
        }
      ])
    )
  }),
  
  rest.post('/api/orders', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ orderId: Date.now() })
    )
  })
]
```

### **3. Онлайн-генераторы данных:**
- **Mockaroo** — генерирует реалистичные данные по схемам
- **Faker.js** + JSON Server:
```javascript
// generate-db.js
const { fakerRU } = require('@faker-js/faker')

const products = Array.from({ length: 50 }, () => ({
  id: fakerRU.string.uuid(),
  name: `${fakerRU.commerce.productAdjective()} ${fakerRU.commerce.productName()}`,
  price: fakerRU.commerce.price({ min: 5000, max: 150000 }),
  category: fakerRU.helpers.arrayElement([
    'Холодильники', 'Плиты', 'Стиральные машины', 
    'Пылесосы', 'Микроволновки', 'Кофемашины'
  ]),
  description: fakerRU.commerce.productDescription(),
  inStock: fakerRU.datatype.boolean(),
  rating: fakerRU.number.float({ min: 1, max: 5, precision: 0.1 }),
  image: fakerRU.image.urlLoremFlickr({ category: 'appliance' })
}))

console.log(JSON.stringify({ products }, null, 2))
```

---

## 🌐 **Готовые коммерческие API для тестирования:**

### **1. Shopify Storefront API** (тестовый магазин)
- Можно создать тестовый магазин в Shopify
- Реальные e-commerce эндпоинты
- GraphQL и REST

### **2. Commerce.js** (демо-версия)
- Специализированный e-commerce API
- Есть демо-ключи для тестирования

---

## 📱 **Мой рекомендации для вашего случая:**

| Сценарий | Решение |
|----------|---------|
| **Быстрый старт, демо** | FakeStore API или DummyJSON |
| **Полный контроль, реалистичные данные** | JSON Server + Faker.js |
| **Тестирование фронтенда без бэкенда** | MSW (Mock Service Worker) |
| **Продакшн-подобное тестирование** | Тестовый Shopify + GraphQL |

---

## 🔧 **Пример структуры API для магазина техники:**

```javascript
// Типичные эндпоинты:
GET    /api/products           // Все товары
GET    /api/products?category=Холодильники&minPrice=30000
GET    /api/products/:id       // Конкретный товар
GET    /api/categories         // Категории
GET    /api/brands            // Бренды
POST   /api/cart              // Добавить в корзину
GET    /api/cart/:userId      // Корзина пользователя
POST   /api/orders            // Оформить заказ
GET    /api/orders/:userId    // История заказов
POST   /api/reviews           // Добавить отзыв
GET    /api/products/:id/reviews // Отзывы товара
```

---

## 🚀 **Самый быстрый старт:**
1. Установите JSON Server: `npm install -g json-server`
2. Скачайте готовый файл БД: [electronics-db.json](https://gist.githubusercontent.com/ пример)
3. Запустите: `json-server --watch electronics-db.json`
4. Используйте:
   - `http://localhost:3000/products`
   - `http://localhost:3000/categories`
   - `http://localhost:3000/orders`

Это даст вам полноценный REST API с персистентными данными, фильтрацией и всеми необходимыми методами для интернет-магазина.
