# product-management-api
Product Management API is a Node.js backend built with Express, TypeScript, and Prisma. It provides a secure and scalable REST API for managing products and their updates, including authentication, validation, and role-based access control.

## Features:
- 🔐 Authentication & Authorization (JWT-based)
- 📦 CRUD Operations for Products & Updates
- ✅ Request Validation with express-validator
- 🛢 Database ORM using Prisma & PostgreSQL
- ⚡ Middleware for Error Handling & Security
- 🛠 Modular Code Structure for Scalability

## Tech Stack:
- Node.js & Express.js
- TypeScript
- Prisma ORM (PostgreSQL)
- Express Validator
- JWT Authentication

## 🚀 Getting Started
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/product-management-api.git
cd product-management-api
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a .env file in the root directory and add the following:
```code
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
PORT=5432
```

### 4️⃣ Run Migrations
```bash
npx prisma migrate dev
```

### 5️⃣ Start the Server
```bash
npm run dev
```

## 📖 API Endpoints
### Authentication
| Method | Endpoint   | Description |
|--------|-----------|-------------|
| **POST**  | `/signup` | Register a new user |
| **POST**  | `/login`  | Authenticate a user |

---

### Products
| Method  | Endpoint         | Description |
|---------|-----------------|-------------|
| **GET**    | `/products`        | Get all products owned by the authenticated user |
| **GET**    | `/products/:id`    | Get a specific product by ID (if owned by the user) |
| **POST**   | `/products`        | Create a new product |
| **PUT**    | `/products/:id`    | Update a product (if owned by the user) |
| **DELETE** | `/products/:id`    | Delete a product (if owned by the user) |

---

### Updates
| Method  | Endpoint         | Description |
|---------|-----------------|-------------|
| **GET**    | `/updates`        | Get all updates related to products owned by the user |
| **GET**    | `/updates/:id`    | Get a specific update by ID |
| **POST**   | `/updates`        | Create an update for a product |
| **PUT**    | `/updates/:id`    | Update an update by ID |
| **DELETE** | `/updates/:id`    | Delete an update by ID |

---

## 🛡 Authentication & Security
- JWT-based authentication is implemented.
- Protected routes require authentication.
- Request validation ensures secure input handling.

## 🎯 Contributing
- Contributions are welcome! If you find a bug or have a feature request, please create an issue or submit a pull request.
