import axios from 'axios';
import { productsData } from './productsData';

// Determine base API URL (supports Vite env or default proxy)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token if stored
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('atelier_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch all products with optional category, search, and maxPrice filters
 * Falls back to local dataset if backend is unreachable (e.g. offline or static deployment)
 */
export async function getProducts({ category = 'All', search = '', maxPrice = '', forceError = false } = {}) {
  if (forceError) {
    throw new Error('Unable to connect to ATELIER catalog service. Please check your connection and retry.');
  }

  try {
    const params = {};
    if (category && category !== 'All') params.category = category;
    if (search && search.trim()) params.search = search.trim();
    if (maxPrice) params.maxPrice = maxPrice;

    const response = await apiClient.get('/products', { params });
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (err) {
    console.warn('[Catalog Service]: Backend API unavailable, utilizing local ATELIER catalog.', err.message);
  }

  // Graceful local catalog fallback
  let result = [...productsData];

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (maxPrice) {
    const numMax = Number(maxPrice);
    if (!isNaN(numMax)) {
      result = result.filter(p => p.price <= numMax);
    }
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  return result;
}

/**
 * Fetch a single product by its ID
 */
export async function getProductById(id, { forceError = false } = {}) {
  if (forceError) {
    throw new Error('Failed to retrieve product details. The item may be temporarily unavailable.');
  }

  try {
    const response = await apiClient.get(`/products/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (err) {
    console.warn(`[Catalog Service]: Backend API getProductById(${id}) unavailable, falling back to local dataset:`, err.message);
  }

  const numericId = Number(id);
  const product = productsData.find(p => p.id === numericId || p._id === id);

  if (!product) {
    throw new Error(`Product with ID ${id} was not found in the catalog.`);
  }

  return product;
}

/**
 * Register User API
 */
export async function registerUserApi({ name, email, password, role = 'user' }) {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password, role });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Registration failed';
    throw new Error(message);
  }
}

/**
 * Login User API
 */
export async function loginUserApi(email, password) {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Login failed';
    throw new Error(message);
  }
}

/**
 * Create Order API
 */
export async function createOrderApi({ items, totalAmount, shippingAddress }) {
  try {
    const response = await apiClient.post('/orders', { items, totalAmount, shippingAddress });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to place order';
    throw new Error(message);
  }
}

/**
 * Get My Orders API
 */
export async function getMyOrdersApi() {
  try {
    const response = await apiClient.get('/orders/my');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch orders';
    throw new Error(message);
  }
}

export default apiClient;
