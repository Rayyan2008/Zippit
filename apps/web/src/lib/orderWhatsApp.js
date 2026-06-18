import { site } from '@/data/site.js';

export function buildWhatsAppMessage({ form, cartItems, total }) {
  const lines = [];
  lines.push(`*New Order — ${site.brand.name}*`);
  lines.push('');
  lines.push(`*Name:* ${form.name}`);
  lines.push(`*Phone:* ${form.phone}`);
  lines.push(`*Address:* ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`);
  lines.push('');
  lines.push('*Order Items:*');

  cartItems.forEach((item) => {
    const product = item.product || {};
    const variant = item.variant || {};
    const variantLabel = variant.title && variant.title !== 'Default'
      ? ` (${variant.title})`
      : '';

    // Prefer already-formatted price coming from cart
    const linePrice = variant.price_formatted || '';
    lines.push(`• ${product.title || 'Item'}${variantLabel} × ${item.quantity} — ${linePrice}`);
  });

  lines.push('');
  lines.push(`*Total: ₹${Number(total || 0).toFixed(2)}*`);

  if (form.notes?.trim()) {
    lines.push('');
    lines.push(`*Notes:* ${form.notes.trim()}`);
  }

  lines.push('');
  lines.push('Please confirm my order. Thank you!');

  return lines.join('\n');
}

export function getWhatsAppUrl({ customerPhone, message }) {
  // customerPhone is not used for wa.me here, we use brand whatsapp number.
  // It is kept for future extension.
  const waNumber = site.brand.whatsapp;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

