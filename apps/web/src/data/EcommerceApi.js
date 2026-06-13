/**
 * EcommerceApi.js — powered by Supabase.
 *
 * Normalizes the DB shape (name, price, image, stock…)
 * into the shape all existing components expect
 * (title, variants, images, price_formatted…).
 */
import { supabase } from '../lib/supabase';

// ─── Normalizer ──────────────────────────────────────────────
function normalize(p) {
  // Inventory logic:
  //   in_stock: true  + stock > 0  → track inventory (capped at stock)
  //   in_stock: true  + stock = 0  → unlimited (don't track, no block)
  //   in_stock: false              → blocked
  const trackedStock = p.stock != null && p.stock > 0;
  const manage_inventory = !p.in_stock;          // only lock when out of stock
  const inventory_quantity = p.in_stock
    ? (trackedStock ? p.stock : 999)             // 999 = "unlimited"
    : 0;

  return {
    id:          p.id,
    title:       p.name,
    subtitle:    '',
    description: p.description || '',
    category:    p.category,
    ribbon_text: p.featured ? 'Featured' : null,
    rating:      0,
    image:       p.image || '',
    images:      p.image ? [{ url: p.image }] : [],
    variants: [
      {
        id:                   `${p.id}-default`,
        title:                'Default',
        price_formatted:      `₹${p.price}`,
        sale_price_formatted: null,
        manage_inventory,
        inventory_quantity,
      },
    ],
    additional_info: [],
    // raw fields kept so admin pages still work
    name:     p.name,
    price:    p.price,
    in_stock: p.in_stock,
    featured: p.featured,
    stock:    p.stock,
  };
}

// ─── Public API ──────────────────────────────────────────────

export async function getProducts({ category, limit } = {}) {
  let q = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== 'All') q = q.eq('category', category);
  if (limit) q = q.limit(limit);

  const { data, error } = await q;
  if (error) throw error;

  return { products: (data || []).map(normalize) };
}

export async function getProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error('Product not found');
  return normalize(data);
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('name');

  if (error || !data?.length) {
    const { data: prods } = await supabase.from('products').select('category');
    const unique = [...new Set((prods || []).map(p => p.category))].filter(Boolean);
    return ['All', ...unique];
  }

  return ['All', ...data.map(c => c.name)];
}

export function formatCurrency(value) {
  if (typeof value === 'string') return value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default { getProducts, getProduct, getCategories, formatCurrency };