# 🛍️ ShopVerse — Full-Stack E-Commerce Application

A production-level e-commerce portfolio project built with vanilla HTML/CSS/JavaScript frontend and Node.js/Express backend, integrated with Firebase and Razorpay.

![ShopVerse](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800)

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Authentication |
| **Payments** | Razorpay |
| **Deployment** | Render (backend) + Netlify/Vercel (frontend) |

## ✨ Features

### Core
- 🏠 **Homepage** — Hero banner, search, category cards, featured products
- 📦 **Product Listing** — Grid layout, filters (category, price, rating), search, sort
- 🔍 **Product Detail** — Image gallery, description, reviews, add to cart
- 🛒 **Shopping Cart** — Add/remove items, quantity update, localStorage persistence
- 💳 **Checkout** — Shipping form, Razorpay payment gateway, order confirmation
- 🔐 **Authentication** — Signup/Login with email or Google via Firebase Auth
- 👤 **Profile** — Order history, wishlist, account settings

### Bonus
- 💝 **Wishlist System** — Save favorite products
- 🛠️ **Admin Panel** — Add/delete products, seed demo data, stats dashboard
- 🔍 **Product Search** — Real-time search with debouncing
- ⏳ **Loading States** — Skeleton loaders, spinners, smooth transitions
- 📱 **Fully Responsive** — Mobile-first design, works on all devices
- 🎨 **Premium UI** — Dark theme, glassmorphism, gradient accents, micro-animations

## 📁 Project Structure

```
├── frontend/
│   ├── index.html              # Homepage
│   ├── products.html           # Product listing
│   ├── product-detail.html     # Product detail
│   ├── cart.html               # Shopping cart
│   ├── checkout.html           # Checkout + payment
│   ├── login.html / signup.html # Authentication
│   ├── profile.html            # User profile
│   ├── admin.html              # Admin panel
│   ├── order-success.html      # Order confirmation
│   ├── css/styles.css          # Design system
│   └── js/
│       ├── firebase-config.js  # Firebase client config
│       ├── app.js              # Core logic (nav, toasts, helpers)
│       ├── auth.js             # Authentication
│       ├── products.js         # Product listing
│       ├── product-detail.js   # Product detail
│       ├── cart.js             # Cart (localStorage)
│       ├── checkout.js         # Checkout + Razorpay
│       ├── profile.js          # Profile page
│       └── admin.js            # Admin panel
├── backend/
│   ├── server.js               # Express server
│   ├── package.json
│   ├── .env.example            # Environment vars template
│   ├── config/firebase.js      # Firebase Admin SDK
│   ├── middleware/auth.js      # Auth middleware
│   └── routes/
│       ├── products.js         # GET/POST /products
│       ├── cart.js             # POST/GET /cart
│       ├── orders.js           # POST/GET /orders
│       └── auth.js             # Auth + wishlist routes
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Firebase project (Firestore + Authentication enabled)
- Razorpay account (optional, demo mode works without it)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd shopverse

# Install backend dependencies
cd backend
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database** and **Authentication** (Email/Password + Google)
4. Get your web app config → update `frontend/js/firebase-config.js`
5. Generate a service account key → use values in `.env`

### 3. Set Environment Variables

```bash
# Copy example env
cp .env.example .env

# Edit with your values
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-sa@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
RAZORPAY_KEY_ID=your_key        # optional
RAZORPAY_KEY_SECRET=your_secret  # optional
PORT=3000
FRONTEND_URL=http://localhost:5500
```

### 4. Run Locally

```bash
# Backend (from /backend)
npm run dev

# Frontend — open with Live Server (VS Code) or:
# npx serve ../frontend -l 5500
```

### 5. Seed Demo Products

Visit the Admin panel (`admin.html`) and click **"Seed Demo Products"** — or use the API:

```bash
curl -X POST http://localhost:3000/api/products/seed
```

## 🚀 Deployment

### Backend → Render

1. Push to GitHub
2. Create a **Web Service** on [Render](https://render.com)
3. Set **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add all environment variables from `.env`

### Frontend → Netlify / Vercel

1. Create a site on [Netlify](https://netlify.com) or [Vercel](https://vercel.com)
2. Set **Publish Directory**: `frontend`
3. Update `frontend/js/firebase-config.js` → set `API_BASE_URL` to your Render URL

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (filters, search, pagination) | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Add product (admin) | Yes |
| POST | `/api/products/seed` | Seed demo data | No |
| DELETE | `/api/products/:id` | Delete product (admin) | Yes |
| GET | `/api/cart` | Get user cart | Yes |
| POST | `/api/cart` | Save cart | Yes |
| GET | `/api/orders` | Get user orders | Yes |
| POST | `/api/orders` | Create order | Yes |
| POST | `/api/auth/register` | Register user profile | Yes |
| GET | `/api/auth/profile` | Get profile | Yes |
| POST | `/api/auth/wishlist` | Toggle wishlist item | Yes |
| POST | `/api/payment/create-order` | Create Razorpay order | No |
| GET | `/api/health` | Health check | No |

## 📄 License

MIT — Built as a portfolio project demonstrating full-stack development skills.
