import axios from 'axios';
import { productsData } from './productsData';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch all products with optional category, search, and simulated network delay
 */
export async function getProducts({ category = 'All', search = '', forceError = false } = {}) {
  // Simulate API network request latency (400ms) to allow loading spinner to render
  await new Promise(resolve => setTimeout(resolve, 350));

  if (forceError) {
    throw new Error('Unable to connect to ATELIER catalog service. Please check your connection and retry.');
  }

  let result = [...productsData];

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
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
  // Simulate network request latency (300ms)
  await new Promise(resolve => setTimeout(resolve, 300));

  if (forceError) {
    throw new Error('Failed to retrieve product details. The item may be temporarily unavailable.');
  }

  const numericId = Number(id);
  const product = productsData.find(p => p.id === numericId);

  if (!product) {
    throw new Error(`Product with ID ${id} was not found in the catalog.`);
  }

  return product;
}

export default apiClient;
