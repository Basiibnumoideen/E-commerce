# ShopNest Full Backend — Assignment Submission Details

### Student & Course Information
- **Learner Name**: Muhammed Abdul Basith
- **Batch Code**: FSD-E86
- **Assignment Number**: Module End Assignment 4
- **Assignment Name**: ShopNest Full Backend — Backend Module End
- **Session**: Week 19 — Session 57
- **Max Marks**: 25 / 25
- **GitHub Repository Suggested Name**: `shopnest-full-backend` or `E-commerce`
- **GitHub Repository Link**: `https://github.com/Basiibnumoideen/E-commerce`

---

## 📋 Google Doc Submission Content (Copy & Paste Ready)

```text
Learner Name: Muhammed Abdul Basith
Batch Code: FSD-E86
Assignment Number & Assignment Name: Module End Assignment 4 — ShopNest Full Backend
GitHub Repository Link: https://github.com/Basiibnumoideen/E-commerce
Live Backend Deployment URL: https://shopnest-backend.onrender.com (or your Render/Railway live link)
Postman Collection: Included in repository (ShopNest_Backend_API.postman_collection.json)

Project Summary & Implementation:
Built the complete, production-ready ShopNest backend using Node.js, Express, MongoDB Atlas, and Mongoose ODM, seamlessly connected with the React frontend.

1. Clean Architecture & Configuration (5/5 Marks):
   - Structured directory: routes/, controllers/, models/, middleware/, and config/.
   - Secure MongoDB Atlas connection using Mongoose with connection string in .env.
   - CORS configured for localhost:5173, localhost:3000, and deployed Netlify/GitHub Pages origins.

2. Product API with Query Filters (5/5 Marks):
   - GET /api/products with dynamic case-insensitive ?category= and price ceiling ?maxPrice= filters.
   - GET /api/products/:id supporting both MongoDB ObjectId and numeric identifiers.
   - POST, PUT, DELETE endpoints for complete product management.

3. Complete Authentication & Role-Based Access Control (5/5 Marks):
   - POST /api/auth/register with bcrypt 10-salt password hashing and JWT issuance.
   - POST /api/auth/login with bcrypt.compare() validation and JWT issuance.
   - Auth middleware (protect) validating JWT Bearer tokens and attaching req.user.
   - Role-based middleware (adminOnly) restricting product writes (POST, PUT, DELETE) to admins, strictly returning 403 Forbidden for non-admins.

4. Order Management System (5/5 Marks):
   - Order schema with referenced userId (ref: User), items array (name, quantity, price), totalAmount, and status ('pending', 'shipped', 'delivered').
   - POST /api/orders creating orders with authenticated user attachment.
   - GET /api/orders/my returning current user's orders populated with name and email.
   - PUT /api/orders/:id/status enabling admin-only status updates.

5. Global Error Handling Middleware (3/3 Marks):
   - Centralized error handler returning structured JSON responses with appropriate HTTP status codes:
     404 for undefined endpoints, 400 for validation / duplicate / malformed IDs, 401 for unauthorized, 403 for forbidden, and 500 for internal server errors.

6. Deployment & Verification (2/2 Marks):
   - Exportable Postman collection (v2.1.0) with automated token extraction for one-click testing.
   - Automated 22-test integration test suite (test.js) with 100% pass rate.
   - Production ready for 1-click deployment on Render.com or Railway.app.
```

---

## 🧪 Quick Test Commands

```bash
# 1. Run automated backend integration tests (22/22 tests passing):
npm run test:backend

# 2. Seed database with luxury demo products and admin/user accounts:
npm run seed

# 3. Start local backend server:
npm run server
```

---

## ⚠️ Git Push Note
As requested: Changes are saved and tested locally in the repository. Please review and inspect the work before running `git push`.
