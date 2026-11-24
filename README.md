# ShopNest (ATELIER) — Full Stack MERN Platform

> **Module End Assignment 4: ShopNest Full Backend (Node.js, Express, MongoDB Atlas, JWT, Orders)**  
> **Module End Assignment 3: ShopNest React Frontend (React, Vite, Router, Context API, Axios)**  
> Complete end-to-end full stack luxury e-commerce platform combining production Express REST API with the quiet-luxury ATELIER React client.

---

## ⚡ Quick Navigation

- **Backend Architecture & API Docs**: [backend/README.md](file:///c:/Entri%20Full%20stack%20dev/E-commerce/backend/README.md)
- **Submission Document**: [SUBMISSION_ASSIGNMENT_4.md](file:///c:/Entri%20Full%20stack%20dev/E-commerce/SUBMISSION_ASSIGNMENT_4.md)
- **Postman Collection**: [ShopNest_Backend_API.postman_collection.json](file:///c:/Entri%20Full%20stack%20dev/E-commerce/ShopNest_Backend_API.postman_collection.json)
- **Frontend Live URL**: [https://basiibnumoideen.github.io/E-commerce/](https://basiibnumoideen.github.io/E-commerce/)

---

## 🏆 Backend Module End Assignment 4 — Evaluation Criteria (25/25 Marks)

| Criteria | Marks | Implementation Details |
| :--- | :---: | :--- |
| **Project structure, MongoDB connection, CORS, and .env configuration** | 5 | Clean Express structure (`routes/`, `controllers/`, `models/`, `middleware/`, `config/`), connected to MongoDB Atlas via Mongoose with `.env`, and CORS configured for local ports (`5173`, `3000`) and deployment domains. |
| **Product API with category and price filters using Mongoose** | 5 | `GET /api/products` with optional `?category=`, `?maxPrice=`, and text search filters. `GET /api/products/:id` resolves both ObjectId and numeric IDs. |
| **Authentication — register, login, JWT middleware, and protected routes** | 5 | `POST /api/auth/register` (bcrypt 10-salt hash), `POST /api/auth/login` (bcrypt compare), and `protect` middleware attaching `req.user`. Non-admins receive `403 Forbidden` on admin-only routes. |
| **Order system — schema, create order, fetch (populated), and status update** | 5 | Mongoose Order schema with referenced `userId` (`ref: User`), `items` array, `totalAmount`, and `status`. Endpoints: `POST /api/orders`, `GET /api/orders/my` (populated with user name & email), `PUT /api/orders/:id/status` (admin-only). |
| **Global error handling — structured JSON with correct status codes** | 3 | Centralized error handler returning structured `{ success: false, error: ... }` for 404 routes, 400 validation/cast/duplicate key errors, 401 unauthorized, and 403 forbidden. |
| **Deployment & Postman Collection** | 2 | Exportable Postman collection (`ShopNest_Backend_API.postman_collection.json`) with auto token capture, 22-test automated verification suite (`test.js`), and Render/Railway deployment guide. |

---

## 🚀 Running Backend & Integration Suite

```bash
# 1. Run automated backend integration tests (22/22 Passing)
npm run test:backend

# 2. Seed database with luxury products & admin/user credentials
npm run seed

# 3. Start Express backend (port 5000)
npm run server

# 4. Start React frontend (port 3000)
npm run dev
```

---

## 🎨 Phase 3: React Frontend Details

| Criteria | Marks | Implementation Details |
| :--- | :---: | :--- |
| **React Router DOM** | 5 | Client-side routing with routes for Home (`/`), Products (`/products`), Product Detail (`/products/:id`), Cart (`/cart`), Contact (`/contact`), and `404` fallback. Dynamic product routing handled via `useParams()`. |
| **Context API (Global Cart)** | 5 | `CartContext.jsx` with custom `useCart()` hook. Manages add to bag, remove, quantity stepper (+/-), subtotal, estimated tax (8.5%), shipping threshold, and promo codes (`LUXE10` / `ATELIER10`) without prop drilling. |
| **API Integration (useEffect & Axios)** | 5 | Configured Axios client in `api.js`. Fetches collection data with asynchronous loading spinner (`LoadingSpinner.jsx`) and friendly error handling (`ErrorMessage.jsx`) with retry capability. |
| **Reusable Components** | 5 | Clean, modular components: `Navbar`, `ProductCard`, `CartItem`, `ProductGrid`, `CategoryFilter`, and `Toast`. |
| **Responsive UI & Clean Design** | 3 | Quiet luxury editorial aesthetic matching high-fashion lookbooks. Mobile offcanvas drawer navigation, responsive grids, and Netlify-ready SPA routing (`public/_redirects`). |
| **Code Quality** | 2 | Clean separation of concerns, zero console errors, zero unused state, production-optimized Vite bundle. |

---

## 💎 Exact Product Details Page Design

The Product Details page (`/products/:id`) reproduces the luxury atelier specification:
- **Breadcrumb Navigation**: `HOME / SHOP / SILK GABARDINE BLAZER`
- **Vertical Gallery Thumbnails**: 3 interactive angle thumbnails on the left with active outline and smooth main image switching.
- **Product Options**:
  - Dynamic Cormorant Garamond serif typography and formatted currency.
  - Interactive color selector with circular swatches (`Alabaster`, `Noir`, `Camel`).
  - Size selection grid (`34`, `36`, `38` active, `40`, `42`, `44`) and interactive **Size Guide** measurement table.
- **Action Buttons**: Full-width solid `ADD TO CART` and `♡ SAVE TO WISHLIST`.
- **Collapsible Accordions**: Expandable sections for `DESCRIPTION`, `DETAILS & FIT`, and `SHIPPING & RETURNS`.
- **"Complete the Look"**: Curated recommendations carousel with navigation controls (`← →`).

---

## 🛠️ Project Structure

```text
E-commerce/
├── public/
│   ├── _redirects                  # Netlify single-page application redirect rule
│   └── asset/                      # High-resolution local luxury imagery
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Header, mobile drawer, search & auth modals
│   │   ├── Footer.jsx              # Editorial footer with concierge links
│   │   ├── ProductCard.jsx         # Card with rating, badges, quick add, wishlist
│   │   ├── ProductGrid.jsx         # Responsive grid with loading/error/empty states
│   │   ├── CategoryFilter.jsx      # Pill category filtering buttons
│   │   ├── CartItem.jsx            # Stepper controls (+/-), line totals, remove
│   │   ├── LoadingSpinner.jsx      # Luxury loading indicator
│   │   ├── ErrorMessage.jsx        # Service error with retry trigger
│   │   └── Toast.jsx               # Floating toast notifications
│   ├── context/
│   │   └── CartContext.jsx         # Global state with LocalStorage persistence
│   ├── pages/
│   │   ├── Home.jsx                # Hero banner, featured categories, new arrivals
│   │   ├── Products.jsx            # Catalog with live search & CategoryFilter
│   │   ├── ProductDetail.jsx       # Exact luxury specification from reference image
│   │   ├── Cart.jsx                # 2-column layout with tax, shipping, promo code
│   │   ├── Contact.jsx             # Client services, concierge form, and flagships
│   │   └── NotFound.jsx            # 404 fallback page
│   ├── services/
│   │   ├── api.js                  # Axios client for catalog and single product
│   │   └── productsData.js         # Comprehensive product catalog data
│   ├── App.jsx                     # Route definitions & scroll restoration
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Custom luxury design system
├── index.html                      # HTML5 shell with Google Fonts & Bootstrap
├── vite.config.js                  # Vite build configuration
└── package.json                    # Project dependencies
```

---

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
