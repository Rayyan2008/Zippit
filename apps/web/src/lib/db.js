import { supabase } from './supabase.js';

const PRODUCT_IMAGES_BUCKET = 'product-images';



// Uploads a JPG product image to Supabase Storage and returns the public URL.
export async function uploadProductImageToStorage(file, { productId } = {}) {
  if (!file) throw new Error('No file provided');
  if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
    throw new Error('Only JPG images are allowed');
  }

  const idPart = productId ? String(productId) : crypto.randomUUID();
  const fileExt = 'jpg';
  // Keep storage object path simple to avoid any bucket/path restrictions
  const path = `${idPart}-${Date.now()}.${fileExt}`;


  const normalizedContentType = file.type === 'image/jpg' ? 'image/jpeg' : file.type;

  // Debug-friendly upload call (to diagnose Supabase Storage 400 responses)
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      contentType: normalizedContentType,
      upsert: true,
      cacheControl: '3600',
    });

  if (uploadError) {
    console.error('Supabase storage upload failed', {
      bucket: PRODUCT_IMAGES_BUCKET,
      path,
      file: {
        name: file?.name,
        type: file?.type,
        size: file?.size,
      },
      normalizedContentType,
      uploadData,
      error: {
        name: uploadError?.name,
        message: uploadError?.message,
        statusCode: uploadError?.statusCode,
        details: uploadError?.details,
        hint: uploadError?.hint,
      },
    });
    throw uploadError;
  }


  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}


// ============================================
// PRODUCTS
// ============================================
export async function getProducts({ category, limit, featured } = {}) {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (category && category !== 'All') query = query.eq('category', category);
  if (featured) query = query.eq('is_featured', true);
  if (limit) query = query.limit(Number(limit));
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getProduct(id) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createProduct(product) {
  const payload = {
    ...product,
    name: product.name || product.title || null,
    title: product.title || product.name || null,
  };



  const { data, error } = await supabase.from('products').insert([payload]).select().single();
  if (error) throw error;
  return data;
}



export async function updateProduct(id, updates) {
  const payload = { ...updates };
  if (!payload.name && payload.title) payload.name = payload.title;
  if (!payload.title && payload.name) payload.title = payload.name;

  // Keep image fields consistent
  if (payload.images?.length && (!payload.image || typeof payload.image !== 'string')) {
    payload.image = payload.images?.[0]?.url || null;
  }

  const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}


export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ============================================
// CATEGORIES
// ============================================
export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function createCategory(category) {
  const { data, error } = await supabase.from('categories').insert([category]).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ============================================
// ORDERS
// ============================================
export async function getOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getOrder(id) {
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createOrder(order) {
  const order_number = `ORD-${Date.now()}`;
  const payload = { ...order, order_number };
  const { data, error } = await supabase.from('orders').insert([payload]).select().single();
  if (error) throw error;
  try {
    await supabase.from('order_status_history').insert([
      { order_id: data.id, status: order?.status || 'Pending Payment', note: 'Order placed' }
    ]);
  } catch (e) { console.warn('History insert failed:', e); }
  return data;
}

export async function updateOrderStatus(id, status, note = '') {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  try {
    await supabase.from('order_status_history').insert([{ order_id: id, status, note }]);
  } catch (e) { console.warn('History insert failed:', e); }
  return data;
}

// "Delete" for admin should be a soft-delete so dashboard metrics remain stable.
// We archive the order instead of removing it.
export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').update({ status: 'Archived' }).eq('id', id);
  if (error) throw error;

  // Keep history for audit/troubleshooting.
  return true;
}


export async function resetDashboardData() {
  const { error: historyError } = await supabase.from('order_status_history').delete();
  if (historyError) throw historyError;

  return true;
}

// ============================================
// INQUIRIES
// ============================================
export async function getInquiries() {
  const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createInquiry(inquiry) {
  const { data, error } = await supabase.from('inquiries').insert([inquiry]).select().single();
  if (error) throw error;
  return data;
}

export async function updateInquiry(id, updates) {
  const { data, error } = await supabase.from('inquiries').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteInquiry(id) {
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw error;
}

// ============================================
// COUPONS
// ============================================
export async function getCoupons() {
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function validateCoupon(code, orderTotal) {
  const { data, error } = await supabase.from('coupons').select('*').eq('code', code.toUpperCase()).eq('is_active', true).single();
  if (error || !data) return { valid: false, message: 'Invalid coupon code' };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { valid: false, message: 'Coupon has expired' };
  if (data.max_uses && data.used_count >= data.max_uses) return { valid: false, message: 'Coupon usage limit reached' };
  if (orderTotal < (data.min_order || 0)) return { valid: false, message: `Minimum order is ₹${data.min_order}` };
  const discount = data.type === 'percentage' ? Math.round(orderTotal * data.value / 100) : data.value;
  return { valid: true, discount, coupon: data };
}

export async function createCoupon(coupon) {
  const payload = {
    ...coupon,
    code: coupon.code.toUpperCase(),
    discount_percent: coupon.type === 'percentage' ? coupon.value : 0,
  };
  const { data, error } = await supabase.from('coupons').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateCoupon(id, updates) {
  const payload = { ...updates };
  if (updates.type === 'percentage' || updates.value !== undefined) {
    payload.discount_percent = updates.type === 'percentage' 
      ? updates.value 
      : (updates.discount_percent !== undefined ? updates.discount_percent : 0);
  }
  const { data, error } = await supabase.from('coupons').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCoupon(id) {
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) throw error;
}

// ============================================
// CUSTOMERS (derived from orders)
// ============================================
export async function getCustomers() {
  const { data, error } = await supabase.from('orders').select('customer_name, customer_email, customer_phone, total, created_at');
  if (error) throw error;
  const map = new Map();
  (data || []).forEach(order => {
    const key = order.customer_email;
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, { name: order.customer_name, email: order.customer_email, phone: order.customer_phone, orderCount: 0, totalSpent: 0 });
    }
    const c = map.get(key);
    c.orderCount++;
    c.totalSpent += Number(order.total) || 0;
  });
  return Array.from(map.values());
}

// ============================================
// DASHBOARD STATS
// ============================================
export async function getDashboardStats() {
  const [productsRes, ordersRes, inquiriesRes] = await Promise.all([
    supabase.from('products').select('id, stock_quantity, stock'),
    supabase.from('orders').select('id, total, status, created_at'),
    supabase.from('inquiries').select('id, status, name, email, created_at'),
  ]);

  const products = productsRes.data || [];
  const orders = ordersRes.data || [];
  const inquiries = inquiriesRes.data || [];

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Order Placed').length;
  const lowStockProducts = products.filter(p => (p.stock_quantity || p.stock || 0) < 5).length;

  const now = new Date();
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthOrders = orders.filter(o => {
      const od = new Date(o.created_at);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    });
    return {
      name: d.toLocaleString('default', { month: 'short' }),
      sales: monthOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
      orders: monthOrders.length,
    };
  });

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    totalInquiries: inquiries.length,
    pendingOrders,
    lowStockProducts,
    chartData,
    recentOrders: orders.slice(-5).reverse(),
    recentInquiries: inquiries.slice(-5).reverse(),
  };
}