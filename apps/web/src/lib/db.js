/**
 * db.js — Supabase data layer
 * Drop-in replacement for all localStorage('zippit_*') patterns.
 *
 * Tables required in Supabase (see supabase/schema.sql):
 *   products, categories, orders, inquiries, coupons
 */

import { supabase } from './supabase';

// ─── helpers ────────────────────────────────────────────────────────────────

function handle({ data, error }) {
  if (error) throw error;
  return data;
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function getProducts({ category, limit } = {}) {
  let q = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (category && category !== 'All') q = q.eq('category', category);
  if (limit) q = q.limit(limit);
  return handle(await q);
}

export async function createProduct(data) {
  return handle(await supabase.from('products').insert([data]).select().single());
}

export async function updateProduct(id, data) {
  return handle(await supabase.from('products').update(data).eq('id', id).select().single());
}

export async function deleteProduct(id) {
  return handle(await supabase.from('products').delete().eq('id', id));
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function getCategories() {
  return handle(await supabase.from('categories').select('*').order('name'));
}

export async function createCategory(data) {
  return handle(await supabase.from('categories').insert([data]).select().single());
}

export async function updateCategory(id, data) {
  return handle(await supabase.from('categories').update(data).eq('id', id).select().single());
}

export async function deleteCategory(id) {
  return handle(await supabase.from('categories').delete().eq('id', id));
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function getOrders() {
  return handle(
    await supabase.from('orders').select('*').order('created_at', { ascending: false })
  );
}

export async function updateOrderStatus(id, status) {
  return handle(await supabase.from('orders').update({ status }).eq('id', id).select().single());
}

export async function deleteOrder(id) {
  return handle(await supabase.from('orders').delete().eq('id', id));
}

// ─── INQUIRIES ───────────────────────────────────────────────────────────────

export async function getInquiries() {
  return handle(
    await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
  );
}

export async function updateInquiry(id, data) {
  return handle(await supabase.from('inquiries').update(data).eq('id', id).select().single());
}

export async function deleteInquiry(id) {
  return handle(await supabase.from('inquiries').delete().eq('id', id));
}

// ─── COUPONS ─────────────────────────────────────────────────────────────────

export async function getCoupons() {
  return handle(await supabase.from('coupons').select('*').order('created_at', { ascending: false }));
}

export async function createCoupon(data) {
  return handle(await supabase.from('coupons').insert([data]).select().single());
}

export async function updateCoupon(id, data) {
  return handle(await supabase.from('coupons').update(data).eq('id', id).select().single());
}

export async function deleteCoupon(id) {
  return handle(await supabase.from('coupons').delete().eq('id', id));
}