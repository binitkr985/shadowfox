# E-commerce Backend API

An intermediate-level RESTful E-commerce Backend API built with Node.js, Express, and MongoDB. It supports JWT authentication, role-based authorization (`user` and `admin`), product inventory management, dynamic shopping cart management, and order processing.

---

## Technologies Used

- **Node.js** & **Express.js** — REST API server framework (ES Modules)
- **MongoDB** & **Mongoose** — Database and ODM
- **JWT (`jsonwebtoken`)** — Stateless user authentication
- **bcrypt** — Secure password hashing
- **express-validator** — Request body and parameter validation
- **envcheckr** & **dotenv** — Environment variable loading and schema validation
- **cors** — Cross-Origin Resource Sharing
- **Nodemon** — Development auto-reloading

---

## Project Structure

```text
intermediate/
│
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── services/
│   ├── authService.js
│   ├── cartService.js
│   └── orderService.js
├── validators/
│   ├── authValidator.js
│   ├── productValidator.js
│   └── cartValidator.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── postman_collection.json
├── README.md
├── seedAdmin.js
└── server.js
```

---

## Installation Instructions

1. Navigate to the `intermediate` project directory:
   ```bash
   cd intermediate
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

---

## Environment Variable Setup

Create a `.env` file in the `intermediate` directory (or copy `.env.example`):

```bash
cp .env.example .env
```

Required environment variables (validated at startup using `envcheckr`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shadowfox-ecommerce
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Optional variables used by seedAdmin.js
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

---

## How to Run the Project

Start the development server with `nodemon`:
```bash
npm run dev
```

Or run in standard mode:
```bash
npm start
```

The API will be available at `http://localhost:5000`.

---

## How to Create an Admin Account

Public registration (`POST /api/auth/register`) always assigns the `user` role and prevents users from assigning themselves `admin`.

To create or promote an admin user safely:

1. Ensure `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are set in `.env`.
2. Run the seed script:
   ```bash
   npm run seed:admin
   ```
3. Log in via `POST /api/auth/login` with those credentials to receive an admin JWT token.

---

## Authentication Instructions

Protected endpoints require a valid JWT token in the `Authorization` header using the `Bearer` scheme:

```http
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoint Documentation

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account (`role: "user"`) |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Protected | Get current logged-in user's profile |

#### `POST /api/auth/register`
**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123"
}
```

**Response (`201 Created`):**
```json
{
  "user": {
    "_id": "6651b2c3d4e5f6a7b8c9d0e1",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "role": "user",
    "createdAt": "2026-11-25T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /api/auth/login`
**Request Body:**
```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

---

### 2. Products (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/products/:id` | Public | Get a single product by ID |
| `POST` | `/api/products` | Admin | Create a new product |
| `PATCH` | `/api/products/:id` | Admin | Update product details or stock |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |

#### `POST /api/products` (Admin Only)
**Request Body:**
```json
{
  "name": "Mechanical Keyboard",
  "description": "RGB hot-swappable mechanical keyboard",
  "price": 79.99,
  "category": "Electronics",
  "stock": 25,
  "imageUrl": "https://example.com/keyboard.jpg"
}
```

**Response (`201 Created`):**
```json
{
  "_id": "6651b2c3d4e5f6a7b8c9d0e2",
  "name": "Mechanical Keyboard",
  "description": "RGB hot-swappable mechanical keyboard",
  "price": 79.99,
  "category": "Electronics",
  "stock": 25,
  "imageUrl": "https://example.com/keyboard.jpg",
  "createdAt": "2026-11-25T12:05:00.000Z",
  "updatedAt": "2026-11-25T12:05:00.000Z"
}
```

---

### 3. Shopping Cart (`/api/cart`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Protected | View current user's cart with dynamic `totalPrice` |
| `POST` | `/api/cart` | Protected | Add product to cart (or increment quantity if already in cart) |
| `PATCH` | `/api/cart/:productId` | Protected | Update quantity of a specific product in cart |
| `DELETE` | `/api/cart/:productId` | Protected | Remove a product from cart |
| `DELETE` | `/api/cart` | Protected | Clear all items from cart |

#### `POST /api/cart`
**Request Body:**
```json
{
  "productId": "6651b2c3d4e5f6a7b8c9d0e2",
  "quantity": 2
}
```

#### `PATCH /api/cart/:productId`
**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (`200 OK`):**
```json
{
  "_id": "6651b2c3d4e5f6a7b8c9d0e3",
  "user": "6651b2c3d4e5f6a7b8c9d0e1",
  "items": [
    {
      "product": {
        "_id": "6651b2c3d4e5f6a7b8c9d0e2",
        "name": "Mechanical Keyboard",
        "price": 79.99,
        "stock": 25
      },
      "quantity": 3,
      "subtotal": 239.97
    }
  ],
  "totalPrice": 239.97
}
```

---

### 4. Orders (`/api/orders` & `/api/admin/orders`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Protected | Place an order from the current cart |
| `GET` | `/api/orders` | Protected | Get logged-in user's order history |
| `GET` | `/api/orders/:id` | Protected | Get specific order details (owner or admin only) |
| `GET` | `/api/admin/orders` | Admin | View all customer orders |
| `PATCH` | `/api/admin/orders/:id/status` | Admin | Update order status |

Allowed order statuses: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`.

#### `POST /api/orders`
No request body is needed; items are taken directly from the authenticated user's cart. Stock is verified and decremented, product names and prices are snapshotted, and the user's cart is cleared.

**Response (`201 Created`):**
```json
{
  "_id": "6651b2c3d4e5f6a7b8c9d0e4",
  "user": "6651b2c3d4e5f6a7b8c9d0e1",
  "items": [
    {
      "product": "6651b2c3d4e5f6a7b8c9d0e2",
      "name": "Mechanical Keyboard",
      "price": 79.99,
      "quantity": 3
    }
  ],
  "totalAmount": 239.97,
  "status": "pending",
  "createdAt": "2026-11-25T12:15:00.000Z"
}
```

#### `PATCH /api/admin/orders/:id/status` (Admin Only)
**Request Body:**
```json
{
  "status": "shipped"
}
```

---

## Error Responses

All error responses return an appropriate HTTP status code (`400`, `401`, `403`, `404`, `409`, `500`) and a clean JSON format:

- **Validation Error (`400 Bad Request`):**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      {
        "type": "field",
        "msg": "Quantity must be an integer greater than zero",
        "path": "quantity",
        "location": "body"
      }
    ]
  }
  ```
- **Unauthorized (`401 Unauthorized`):**
  ```json
  {
    "message": "Not authorized, token missing"
  }
  ```
- **Forbidden (`403 Forbidden`):**
  ```json
  {
    "message": "Access denied: admin privileges required"
  }
  ```
- **Not Found (`404 Not Found`):**
  ```json
  {
    "message": "Product not found"
  }
  ```
- **Conflict (`409 Conflict`):**
  ```json
  {
    "message": "Email is already registered"
  }
  ```

---

## Postman Testing Instructions

A ready-to-import Postman collection is included in [`postman_collection.json`](./postman_collection.json).

1. Open Postman and click **Import** -> select `intermediate/postman_collection.json`.
2. Run `npm run seed:admin` and `npm run dev`.
3. Use **Auth -> Login Admin** and copy the returned `token` into the collection variable `adminToken`.
4. Use **Products -> Create Product** (as Admin) and copy the product `_id` into the collection variable `productId`.
5. Use **Auth -> Register User** and copy the returned `token` into the collection variable `userToken`.
6. Test adding items to the cart (`POST /api/cart`), viewing the cart (`GET /api/cart`), placing an order (`POST /api/orders`), and updating the order status as Admin (`PATCH /api/admin/orders/:id/status`).
