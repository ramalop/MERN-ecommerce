# 🛒 MERN E-Commerce Platform

A full-stack MERN eCommerce application with user shopping flow and admin management features. Built with modern React tooling, Redux Toolkit, and a scalable Node/Express backend.

**Author:** Ramal Kumar — Full Stack Developer

---

## 🚀 Tech Stack

**Frontend**
- React (Vite)
- Redux Toolkit
- Tailwind CSS
- shadcn/ui + Radix UI
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image uploads)
- PayPal integration

---

## ✨ Features

- 🔐 User authentication & authorization
- 🛍️ Product listing and detail pages
- 🧺 Cart management
- 📦 Order creation & tracking
- 👨‍💼 Admin dashboard
- ➕ Product CRUD (admin)
- 🖼️ Product Image upload with Cloudinary for admin
- 💳 PayPal payment integration
- ⭐ Product reviews & ratings system
- 🔎 Search & filtering
- 📱 Fully responsive UI
- 🧠 Redux Toolkit state management

---


---

## ⚙️ Environment Variables

### 🔹 Backend `.env`

CLIENT_BASE_URL
PORT
MONGO_URL
PAYPAL_CLIENT_SECRET
PAYPAL_CLIENT_ID
CLOUDINARY_API_SECRET
CLOUDINARY_API_KEY
CLOUDINARY_CLOUD_NAME


---

### 🔹 Frontend `.env`

VITE_API_URL=http://localhost:5000

git clone https://github.com/ramalop/MERN-ecommerce.git


---

### 2️⃣ Backend setup

cd server
npm install
npm run dev

---

### 3️⃣ Frontend setup


---

## 🔄 Scripts

Both frontend and backend run with: npm run dev


---

## 🛠️ Integrations Used

- MongoDB Atlas
- Cloudinary (media storage)
- PayPal Checkout

---

## 📌 Notes

- Frontend uses Vite env variables (`VITE_` prefix required)
- Backend secrets must never be committed
- CORS controlled via `CLIENT_BASE_URL`
- Designed with scalable Redux slice architecture

---


## 📈 Future Improvements

- Stripe payment option
- Wishlist feature
- Email notifications
- Advanced analytics dashboard

---

## 📡 API Endpoints
Base URL (local):http://localhost:5000/api

| Method | Endpoint           | Description                       |
| ------ | ------------------ | --------------------------------- |
| POST   | `/auth/register`   | Register new user                 |
| POST   | `/auth/login`      | Login user                        |
| POST   | `/auth/logout`     | Logout user                       |
| GET    | `/auth/check-auth` | Verify logged-in user (protected) |
✅ Check Auth
Requires auth middleware (JWT cookie/token)

👨‍💼 Admin — Products APIs

Base: /api/admin/products

| Method | Endpoint        | Description                       |
| ------ | --------------- | --------------------------------- |
| POST   | `/upload-image` | Upload product image (Cloudinary) |
| POST   | `/add`          | Add new product                   |
| PUT    | `/edit/:id`     | Edit product                      |
| DELETE | `/delete/:id`   | Delete product                    |
| GET    | `/get`          | Get all products                  |


📦 Admin — Orders APIs

Base: /api/admin/orders

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| GET    | `/getAllOrders`          | Get all orders            |
| GET    | `/getOrderDetails/:id`   | Get single order details  |
| PUT    | `/update/:id`            | Update order status       |
| GET    | `/getAllDeliveredOrders` | Get delivered orders only |


📊 Admin — Dashboard APIs

Base: /api/admin/dashboard
| Method | Endpoint  | Description               |
| ------ | --------- | ------------------------- |
| GET    | `/users`  | Get all users             |
| GET    | `/recent` | Get recent dashboard data |

🛍️ Shop — Products APIs
Base: /api/shop/products
| Method | Endpoint   | Description           |
| ------ | ---------- | --------------------- |
| GET    | `/get`     | Get filtered products |
| GET    | `/get/:id` | Get product details   |


🧺 Shop — Cart APIs

Base: /api/shop/cart
| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/add`                | Add item to cart     |
| GET    | `/get/:userId`        | Get user cart        |
| PUT    | `/update-cart`        | Update cart quantity |
| DELETE | `/:userId/:productId` | Remove cart item     |


🏠 Shop — Address APIs

Base: /api/shop/adress
(note: spelled “adress” in routes — keep same in requests)

| Method | Endpoint                           | Description        |
| ------ | ---------------------------------- | ------------------ |
| POST   | `/addAdress`                       | Add address        |
| GET    | `/getAdress/:userId`               | Get user addresses |
| PUT    | `/editAdress/:userId/:addressId`   | Edit address       |
| DELETE | `/deleteAdress/:userId/:addressId` | Delete address     |

📦 Shop — Orders APIs

Base: /api/shop/order
| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/create`               | Create order           |
| POST   | `/capture`              | Capture PayPal payment |
| GET    | `/getAllOrders/:userId` | Get user orders        |
| GET    | `/getOrderDetals/:id`   | Get order details      |

🔎 Shop — Search API

Base: /api/shop/search
| Method | Endpoint    | Description                |
| ------ | ----------- | -------------------------- |
| GET    | `/:keyword` | Search products by keyword |

⭐ Shop — Reviews APIs

Base: /api/shop/review
| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/getReviews/:productId` | Get product reviews |
| POST   | `/addReview`             | Add product review  |


🔒 Protected Routes

These endpoints require authentication middleware:
/auth/check-auth
Admin product/order/dashboard routes
Review creation
Order creation
Cart update routes


🧭 System Architecture Diagram

┌───────────────────────────────┐
│           CLIENT              │
│     React + Vite Frontend     │
│-------------------------------│
│ • Shop UI                     │
│ • Admin Dashboard             │
│ • Redux Toolkit Store         │
│ • Axios API Layer             │
└───────────────┬───────────────┘
                │
                │ HTTPS / REST APIs
                ▼
┌──────────────────────────────────────────┐
│              BACKEND API                 │
│           Node.js + Express              │
│------------------------------------------│
│ Routes Layer                              │
│ • /api/auth                               │
│ • /api/admin/*                            │
│ • /api/shop/*                             │
│                                           │
│ Controllers Layer                         │
│ • Auth Logic                              │
│ • Product Logic                           │
│ • Cart & Order Logic                      │
│ • Review System                           │
│                                           │
│ Middleware                                │
│ • JWT Auth Middleware                     │
│ • CORS Config                             │
│ • Cookie Parser                           │
└───────────────┬──────────────────────────┘
                │
                │ Mongoose ODM
                ▼
┌───────────────────────────────┐
│           DATABASE            │
│            MongoDB            │
│-------------------------------│
│ • Users                       │
│ • Products                    │
│ • Orders                      │
│ • Cart                        │
│ • Reviews                     │
│ • Addresses                   │
└───────────────┬───────────────┘
                │
                │ External Services
                ▼
     ┌──────────────────────┐
     │   Cloudinary CDN     │
     │----------------------│
     │ Product Images       │
     └──────────────────────┘

     ┌──────────────────────┐
     │      PayPal API      │
     │----------------------│
     │ Payment Capture      │
     └──────────────────────┘







