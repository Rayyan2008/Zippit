// Razorpay integration removed.
// WhatsApp-based ordering flow is handled directly in CheckoutPage.jsx.
// Kept exports to avoid breaking existing imports in other components.

export async function initiateRazorpayPayment() {
  throw new Error('Razorpay is removed. Use WhatsApp-based checkout instead.');
}

export default function RazorpayCheckout() {
  return null;
}


