
---

# 📦 BACKEND README (Render Deployment)

```md
# 🛒 E-Kart Backend (MERN Ecommerce API)

Production Backend URL:  
👉 https://ekart-backend-rwwh.onrender.com

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- httpOnly Secure Cookies
- Stripe (Payments)
- Nodemailer (OTP Reset)
- Unsplash API (Auto Product Images)

---

## 🔐 Features

- User Signup & Login (JWT + httpOnly cookie)
- Role-based Authentication (Admin/User)
- Protected Routes
- Product CRUD (Admin)
- Cart Management
- Order Management
- Password Reset with OTP (Email)
- Secure Cookie Auth (Production-ready)
- Dynamic Product Image Generation (Unsplash Integration)

---

## 🔒 Authentication Flow

- JWT generated on login
- Stored in httpOnly cookie
- Secure & SameSite configured for production
- Backend verifies token on protected routes

---

## 🌍 Environment Variables

Create a `.env` file:

```

MONGO_URI=your_mongodb_uri
SECRET_KEY=your_jwt_secret
CLIENT_URL=[https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)
UNSPLASH_ACCESS_KEY=your_unsplash_key
SENDER_EMAIL=your_email
NODE_ENV=production

````

---

## 🛠 Installation

```bash
npm install
npm start
````

Server runs on:

```
http://localhost:5000
```

---

## 📦 API Endpoints (Sample)

```
POST   /auth/signup
POST   /auth/login
GET    /auth/check
GET    /products
POST   /products (Admin)
GET    /cart
POST   /orders
```

---

## ☁ Deployment

* Hosted on Render (Free Tier)
* MongoDB hosted on MongoDB Atlas
* Secure production cookie configuration
* CORS configured for frontend domain

---

## 📌 Architecture

Frontend (Vercel)
⬇
Backend (Render)
⬇
MongoDB Atlas

---

## 👨‍💻 Author

Avinash Saroj
Full Stack Developer (MERN)

````

---