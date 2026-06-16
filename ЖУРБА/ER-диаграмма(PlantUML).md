**полноценная ER-диаграмма в формате PlantUML** для информационной системы магазина одежды. Она включает все таблицы, связи, типы отношений и ключевые поля.

---

## 📐 ER-диаграмма (PlantUML)

```plantuml
@startuml
' Диаграмма "сущность-связь" для магазина одежды
' Версия 1.0

!define TABLE(name) entity name << (T,#FFAAAA) >>
!define VIEW(name) entity name << (V,#CCFFCC) >>

' ========== СПРАВОЧНИКИ ==========

TABLE(categories) {
  * id : SERIAL <<PK>>
  --
  name : VARCHAR(100)
  parent_id : INT <<FK>>
  slug : VARCHAR(100)
}

TABLE(brands) {
  * id : SERIAL <<PK>>
  --
  name : VARCHAR(100)
}

TABLE(sizes) {
  * id : SERIAL <<PK>>
  --
  name : VARCHAR(10)
}

TABLE(colors) {
  * id : SERIAL <<PK>>
  --
  name : VARCHAR(50)
  hex_code : CHAR(7)
}

' ========== ОСНОВНЫЕ СУЩНОСТИ ==========

TABLE(products) {
  * id : SERIAL <<PK>>
  --
  name : VARCHAR(255)
  description : TEXT
  gender : VARCHAR(10)
  season : VARCHAR(20)
  is_active : BOOLEAN
  created_at : TIMESTAMP
  brand_id : INT <<FK>>
  category_id : INT <<FK>>
}

TABLE(product_variants) {
  * id : SERIAL <<PK>>
  --
  sku : VARCHAR(50)
  price : DECIMAL(10,2)
  old_price : DECIMAL(10,2)
  weight_kg : DECIMAL(5,2)
  is_active : BOOLEAN
  product_id : INT <<FK>>
  size_id : INT <<FK>>
  color_id : INT <<FK>>
}

' ========== СКЛАД ==========

TABLE(stock) {
  * variant_id : INT <<PK, FK>>
  --
  quantity : INT
  reserved : INT
  available : INT <<GENERATED>>
  updated_at : TIMESTAMP
}

TABLE(stock_movements) {
  * id : SERIAL <<PK>>
  --
  quantity : INT
  type : VARCHAR(20)
  reason : TEXT
  created_at : TIMESTAMP
  variant_id : INT <<FK>>
  user_id : INT <<FK>>
}

' ========== ПОЛЬЗОВАТЕЛИ И ЗАКАЗЫ ==========

TABLE(users) {
  * id : SERIAL <<PK>>
  --
  email : VARCHAR(100)
  phone : VARCHAR(20)
  password_hash : VARCHAR(255)
  full_name : VARCHAR(150)
  role : VARCHAR(20)
  bonus_points : INT
  created_at : TIMESTAMP
}

TABLE(orders) {
  * id : SERIAL <<PK>>
  --
  order_number : VARCHAR(20)
  status : VARCHAR(30)
  total_amount : DECIMAL(10,2)
  discount_amount : DECIMAL(10,2)
  payment_method : VARCHAR(30)
  payment_status : VARCHAR(20)
  shipping_address : TEXT
  tracking_number : VARCHAR(100)
  created_at : TIMESTAMP
  updated_at : TIMESTAMP
  user_id : INT <<FK>>
}

TABLE(order_items) {
  * id : SERIAL <<PK>>
  --
  quantity : INT
  price_per_unit : DECIMAL(10,2)
  total_price : DECIMAL(10,2) <<GENERATED>>
  order_id : INT <<FK>>
  variant_id : INT <<FK>>
}

' ========== ВОЗВРАТЫ ==========

TABLE(returns) {
  * id : SERIAL <<PK>>
  --
  quantity : INT
  reason : VARCHAR(100)
  status : VARCHAR(20)
  refund_amount : DECIMAL(10,2)
  created_at : TIMESTAMP
  processed_at : TIMESTAMP
  order_id : INT <<FK>>
  user_id : INT <<FK>>
  order_item_id : INT <<FK>>
}

' ========== ДОПОЛНИТЕЛЬНЫЕ ТАБЛИЦЫ ==========

TABLE(price_history) {
  * id : SERIAL <<PK>>
  --
  old_price : DECIMAL(10,2)
  new_price : DECIMAL(10,2)
  changed_at : TIMESTAMP
  reason : VARCHAR(50)
  variant_id : INT <<FK>>
}

TABLE(reviews) {
  * id : SERIAL <<PK>>
  --
  rating : INT
  comment : TEXT
  created_at : TIMESTAMP
  product_id : INT <<FK>>
  user_id : INT <<FK>>
}

TABLE(wishlist) {
  * user_id : INT <<PK, FK>>
  * product_id : INT <<PK, FK>>
  --
  added_at : TIMESTAMP
}

' ========== СВЯЗИ ==========

' Категории (самореференция)
categories ||--o{ categories : "parent_id"

' Товары со справочниками
brands ||--o{ products : "имеет"
categories ||--o{ products : "содержит"

' Варианты товаров
products ||--o{ product_variants : "имеет"
sizes ||--o{ product_variants : "доступен в"
colors ||--o{ product_variants : "доступен в"

' Склад
product_variants ||--|| stock : "имеет остаток"
product_variants ||--o{ stock_movements : "участвует в"
users ||--o{ stock_movements : "выполняет"

' Заказы и пользователи
users ||--o{ orders : "оформляет"

' Заказы и позиции
orders ||--o{ order_items : "содержит"
product_variants ||--o{ order_items : "включается в"

' Возвраты
orders ||--o{ returns : "имеет"
users ||--o{ returns : "оформляет"
order_items ||--o{ returns : "возвращается по"
returns }o--|| order_items : "ссылается на"

' История цен
product_variants ||--o{ price_history : "имеет"

' Отзывы и избранное
products ||--o{ reviews : "получает"
users ||--o{ reviews : "пишет"
users }o--o{ products : "добавляет в избранное (wishlist)"

@enduml
```

---

## 📋 Легенда и расшифровка

### Обозначения связей:
- `||--||` — один к одному (1:1)
- `||--o{` — один ко многим (1:N)
- `}o--o{` — многие ко многим (M:N) с промежуточной таблицей
- `||--||` — обязательная связь
- `}o--||` — необязательная связь (может быть NULL)

### Ключевые особенности:

| Элемент | Пояснение |
| :--- | :--- |
| **`<<PK>>`** | Первичный ключ |
| **`<<FK>>`** | Внешний ключ |
| **`<<GENERATED>>`** | Вычисляемое поле (не хранится, считается автоматически) |
| **`categories.parent_id`** | Самореференция для создания дерева категорий (родитель-потомок) |
| **`wishlist`** | Таблица-связка M:N между пользователями и товарами |
| **`stock.available`** | Виртуальное поле = `quantity - reserved` |

---

## 🔍 Как читать диаграмму (пример)

1. **`products`** имеет связь **1:N** с **`product_variants`**  
   → Один товар (например, "Куртка") может иметь много вариантов (S/чёрный, M/чёрный, S/синий)

2. **`product_variants`** связана **1:1** с **`stock`**  
   → У каждого варианта есть ровно одна запись с остатками

3. **`orders`** и **`order_items`** — связь **1:N**  
   → Один заказ состоит из нескольких позиций

4. **`wishlist`** — связь **M:N** между **`users`** и **`products`**  
   → Один пользователь может добавить много товаров, один товар могут добавить много пользователей

---

## 🛠 Как использовать этот код

1. Скопируйте код в любой редактор PlantUML:
   - Онлайн: [PlantUML Web Server](https://www.plantuml.com/plantuml/uml/)
   - VS Code: установите расширение "PlantUML"
   - IntelliJ IDEA: плагин PlantUML

2. На выходе получите **визуальную ER-диаграмму** с цветовым кодированием:
   - Розовые блоки — таблицы
   - Зелёные — представления (если появятся)

---

## 📦 Что можно добавить (опционально)

Если бизнес-требования вырастут, добавьте:

```plantuml
' Скидки и промокоды
TABLE(promocodes) {
  * id : SERIAL <<PK>>
  code : VARCHAR(50)
  discount_percent : DECIMAL(5,2)
  valid_from : TIMESTAMP
  valid_to : TIMESTAMP
  usage_limit : INT
}

TABLE(order_promocodes) {
  * order_id : INT <<PK, FK>>
  * promocode_id : INT <<PK, FK>>
}
```

```plantuml
' Уведомления
TABLE(notifications) {
  * id : SERIAL <<PK>>
  user_id : INT <<FK>>
  type : VARCHAR(30)
  message : TEXT
  is_read : BOOLEAN
  created_at : TIMESTAMP
}
```

---

## ✅ Резюме

- Диаграмма содержит **14 таблиц**, покрывающих весь бизнес-цикл магазина одежды
- Учтена **специфика товаров** (размеры, цвета, SKU)
- Реализованы **складские операции**, **возвраты** и **история цен**
- Готова к **масштабированию** (добавление промокодов, уведомлений, аналитики)

 можно:
- Сгенерировать **SQL-скрипт** для создания всех таблиц
- Добавить **индексы** для ускорения запросов
- Написать **примеры запросов** (выборка каталога с остатками, создание заказа и т.д.)


