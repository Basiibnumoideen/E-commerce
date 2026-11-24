/**
 * ShopNest Full Backend - Comprehensive Automated Verification Test Suite
 * Tests all 25 criteria points across:
 * 1. Health / Project structure / CORS configuration
 * 2. User & Admin Registration & Login (bcrypt + JWT)
 * 3. JWT Authentication & Role Authorization (401 on missing token, 403 on non-admin)
 * 4. Product API: GET all, category filter, maxPrice filter, GET by ID
 * 5. Product Write Routes: Admin POST, PUT, DELETE with role check
 * 6. Order System: POST create order, GET /my (populated with user), PUT /:id/status (admin only)
 * 7. Global Error Handling: Structured JSON for 404, 400, 401, 403
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000';

let userToken = '';
let adminToken = '';
let regularUserId = '';
let createdProductId = '';
let createdOrderId = '';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName} - ${details}`);
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const response = await fetch(url, {
    ...options,
    headers
  });
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  return { status: response.status, data };
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 Running ShopNest Full Backend Automated Test Suite');
  console.log(`🎯 Target API Base URL: ${BASE_URL}`);
  console.log('======================================================\n');

  try {
    // 1. Root & Health Check
    console.log('--- 1. Base URL & Health Check ---');
    const health = await request('/');
    assert(health.status === 200 && health.data.success === true, 'Root health endpoint returns 200 OK');

    // 2. Authentication System (Register & Login)
    console.log('\n--- 2. Authentication System (Register, Login, JWT) ---');
    const testEmailUser = `tester_${Date.now()}@shopnest.com`;
    const regUser = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Automated Tester',
        email: testEmailUser,
        password: 'Password@123',
        role: 'user'
      })
    });
    assert(regUser.status === 201 && !!regUser.data.token, 'Register regular user returns 201 and JWT token');
    userToken = regUser.data.token;
    regularUserId = regUser.data.user._id;

    // Register admin user
    const testEmailAdmin = `admin_${Date.now()}@shopnest.com`;
    const regAdmin = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Admin Tester',
        email: testEmailAdmin,
        password: 'AdminPassword@123',
        role: 'admin'
      })
    });
    assert(regAdmin.status === 201 && regAdmin.data.user.role === 'admin', 'Register admin user returns 201 with admin role');
    adminToken = regAdmin.data.token;

    // Login verification with bcrypt
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmailUser,
        password: 'Password@123'
      })
    });
    assert(loginRes.status === 200 && !!loginRes.data.token, 'Login user with valid credentials returns 200 and JWT');

    // Negative: Login with invalid password
    const badLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmailUser,
        password: 'WrongPassword'
      })
    });
    assert(badLogin.status === 401 && badLogin.data.success === false, 'Login with incorrect password returns 401 Unauthorized');

    // Verify req.user in auth middleware
    const meRes = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(meRes.status === 200 && meRes.data.user.email === testEmailUser, 'Auth middleware successfully validates JWT and attaches req.user');

    // 3. Product Catalog & Filtering (category, maxPrice)
    console.log('\n--- 3. Product API (Mongoose Queries & Filters) ---');
    const allProducts = await request('/api/products');
    assert(allProducts.status === 200 && Array.isArray(allProducts.data.data), 'GET /api/products returns 200 and product list');

    const clothingFilter = await request('/api/products?category=Clothing');
    const allAreClothing = clothingFilter.data.data.every((p) => p.category.toLowerCase() === 'clothing');
    assert(clothingFilter.status === 200 && allAreClothing, 'GET /api/products?category=Clothing filters properly');

    const maxPriceFilter = await request('/api/products?maxPrice=300');
    const allUnder300 = maxPriceFilter.data.data.every((p) => p.price <= 300);
    assert(maxPriceFilter.status === 200 && allUnder300, 'GET /api/products?maxPrice=300 filters by price <= 300');

    // Single product by ID
    const singleProduct = await request('/api/products/1');
    assert(singleProduct.status === 200 && (singleProduct.data.data.id === 1 || singleProduct.data.data.name), 'GET /api/products/:id returns product details');

    // 4. Role-Based Protected Product Write Routes (POST, PUT, DELETE)
    console.log('\n--- 4. Protected Product Write Routes & Role Authorization ---');
    // Unauthenticated attempt (No token) -> Expect 401
    const unauthPost = await request('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Hacker Item',
        category: 'Clothing',
        price: 100,
        description: 'Unauthorized'
      })
    });
    assert(unauthPost.status === 401, 'POST /api/products without JWT returns 401 Unauthorized');

    // Non-Admin attempt (Regular user token) -> Expect 403 Forbidden
    const userPost = await request('/api/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        name: 'User Attempt Item',
        category: 'Clothing',
        price: 100,
        description: 'Should be forbidden'
      })
    });
    assert(userPost.status === 403, 'POST /api/products with non-admin JWT returns 403 Forbidden');

    // Admin attempt -> Expect 201 Created
    const adminPost = await request('/api/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: 'Bespoke Atelier Cape',
        category: 'Outerwear',
        price: 1350,
        description: 'Exquisite tailored wool-cashmere cape crafted in Florence.',
        stock: 8
      })
    });
    assert(adminPost.status === 201 && adminPost.data && adminPost.data.success === true, 'POST /api/products with Admin JWT returns 201 Created');
    createdProductId = adminPost.data && adminPost.data.data ? adminPost.data.data._id : null;

    // Admin PUT Update
    const adminPut = await request(`/api/products/${createdProductId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ price: 1400 })
    });
    assert(adminPut.status === 200 && adminPut.data.data.price === 1400, 'PUT /api/products/:id updates product successfully by Admin');

    // Admin DELETE
    const adminDel = await request(`/api/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminDel.status === 200 && adminDel.data.success === true, 'DELETE /api/products/:id deletes product successfully by Admin');

    // 5. Order Management System
    console.log('\n--- 5. Order System (Schema, Create, Populate, Status Update) ---');
    // Create order with authenticated user
    const createOrderRes = await request('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        items: [
          { name: 'Silk Gabardine Blazer', quantity: 1, price: 1250 },
          { name: 'Classic Oxford Shirt', quantity: 2, price: 185 }
        ],
        totalAmount: 1620,
        shippingAddress: {
          street: '45 Park Avenue',
          city: 'New York',
          state: 'NY',
          postalCode: '10016',
          country: 'USA'
        }
      })
    });
    assert(createOrderRes.status === 201 && createOrderRes.data.data.status === 'pending', 'POST /api/orders creates order with pending status');
    createdOrderId = createOrderRes.data.data._id;

    // Non-authenticated attempt to create order -> 401
    const unauthOrder = await request('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items: [{ name: 'Item', quantity: 1, price: 10 }], totalAmount: 10 })
    });
    assert(unauthOrder.status === 401, 'POST /api/orders without token returns 401');

    // GET /api/orders/my (Populated with user details)
    const myOrdersRes = await request('/api/orders/my', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const orderHasPopulatedUser = myOrdersRes.data.data.some(
      (o) => o.userId && typeof o.userId === 'object' && o.userId.email === testEmailUser
    );
    assert(myOrdersRes.status === 200 && orderHasPopulatedUser, 'GET /api/orders/my returns user orders with populated userId (name, email)');

    // Non-admin attempt to update order status -> Expect 403 Forbidden
    const userUpdateStatus = await request(`/api/orders/${createdOrderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ status: 'shipped' })
    });
    assert(userUpdateStatus.status === 403, 'PUT /api/orders/:id/status by non-admin returns 403 Forbidden');

    // Admin updates order status to 'shipped' -> Expect 200 OK
    const adminUpdateStatus = await request(`/api/orders/${createdOrderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'shipped' })
    });
    assert(adminUpdateStatus.status === 200 && adminUpdateStatus.data.data.status === 'shipped', 'PUT /api/orders/:id/status by Admin updates status to shipped');

    // 6. Global Error Handling
    console.log('\n--- 6. Global Error Handling Middleware ---');
    const notFoundRes = await request('/api/undefined-endpoint-for-test');
    assert(notFoundRes.status === 404 && notFoundRes.data.success === false, 'Undefined routes return structured 404 JSON');

    const badValidation = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Incomplete' })
    });
    assert(badValidation.status === 400 && badValidation.data.success === false, 'Validation errors return structured 400 JSON');

    console.log('\n======================================================');
    console.log(`📊 Test Summary: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
    console.log('======================================================\n');

    if (failedTests > 0) {
      process.exit(1);
    } else {
      console.log('🎉 All backend criteria verified with 100% success!\n');
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test execution error:', err);
    process.exit(1);
  }
}

runTests();
