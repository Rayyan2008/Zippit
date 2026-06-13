import { supabase } from '../lib/supabase.js';

export async function getProducts({ category, limit, featured } = {}) {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (category && category !== 'All') query = query.eq('category', category);
  if (featured) query = query.eq('is_featured', true);
  if (limit) query = query.limit(Number(limit));
  const { data, error } = await query;
  if (error) throw error;
  return {
    products: (data || []).map(normalizeProduct)
  };
}

export async function getProduct(id) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  if (!data) return null;
  return normalizeProduct(data);
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('name').order('name');
  if (error) return ['All', 'Daily Essentials', 'Stationery', 'Makeup', 'Travel', 'Coin', 'Ethnic'];
  return ['All', ...(data || []).map(c => c.name)];
}

export function formatCurrency(value) {
  if (typeof value === 'string') return value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(value);
}

function normalizeProduct(p) {
  const mrp = p.price || 0;
  return {
    ...p,
    title: p.title || p.name,
    image: p.image || (p.images?.[0]?.url),
    variants: [{
      id: `${p.id}-default`,
      title: 'Standard',
      price_formatted: `₹${mrp}`,
      sale_price_formatted: p.sale_price ? `₹${p.sale_price}` : null,
      manage_inventory: false,
      inventory_quantity: 999,
    }],
  };
}

export default { getProducts, getProduct, getCategories, formatCurrency };