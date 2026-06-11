import { products } from './products.js';

export function getProducts({ category, limit } = {}) {
  let result = products;
  if (category && category !== 'All') {
    result = result.filter(p => p.category === category);
  }
  if (limit) result = result.slice(0, limit);
  return Promise.resolve({ products: result });
}

export function getProduct(id) {
  return products.find(p => p.id === id) || null;
}

export function formatCurrency(value) {
  if (typeof value === 'string') return value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default { getProducts, getProduct, formatCurrency };