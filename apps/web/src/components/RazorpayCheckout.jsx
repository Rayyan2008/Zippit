import React, { useEffect } from 'react';
import { createOrder } from '../lib/db.js';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async ({
  amount,
  currency = 'INR',
  customerName,
  customerEmail,
  customerPhone,
  cartItems = [],
  shippingAddress = {},
  onSuccess,
  onFailure,
}) => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    onFailure?.('Failed to load payment gateway');
    return;
  }

  const options = {
    key: 'rzp_test_T0iuJ3LtuWvQXF',
    amount: Math.round(amount * 100),
    currency: currency,
    name: 'Bloom',
    description: 'Handmade Ethnic Accessories',
    image: '/favicon.png',
    prefill: {
      name: customerName || '',
      email: customerEmail || '',
      contact: customerPhone || '',
    },
    theme: {
      color: '#d94350',
    },
    handler: async function (response) {
      try {
        // Save order to Supabase database
        const orderData = {
          customer_name: customerName || 'Customer',
          customer_email: customerEmail || '',
          customer_phone: customerPhone || '',
          total: amount,
          status: 'Confirmed',
          shipping_address: shippingAddress,
          razorpay_payment_id: response.razorpay_payment_id,
          items: cartItems.map(item => {
            // Extract price using same logic as useCart's getCartTotal
            let price = 0;
            const variant = item.variant || item.product?.variants?.[0] || {};
            
            if (variant.sale_price_in_cents !== undefined || variant.price_in_cents !== undefined) {
              price = (variant.sale_price_in_cents ?? variant.price_in_cents ?? 0) / 100;
            } else if (variant.price_formatted) {
              price = parseFloat(String(variant.price_formatted).replace(/[^\d.]/g, '')) || 0;
            } else if (item.product?.price) {
              price = parseFloat(String(item.product.price).replace(/[^\d.]/g, '')) || 0;
            }
            
            return {
              product_id: item.product?.id,
              product_name: item.product?.title || 'Unknown',
              variant_title: item.variant?.title,
              quantity: item.quantity,
              price: price,
              total: price * item.quantity,
            };
          }),
        };

        const createdOrder = await createOrder(orderData);
        
        // Also keep in localStorage for reference
        const existingOrders = JSON.parse(localStorage.getItem('zippit_orders') || '[]');
        existingOrders.push({ ...orderData, id: createdOrder.id, order_number: createdOrder.order_number });
        localStorage.setItem('zippit_orders', JSON.stringify(existingOrders));
        localStorage.setItem('zippit_last_order', JSON.stringify(createdOrder));

        onSuccess?.(createdOrder);
      } catch (error) {
        console.error('Failed to save order:', error);
        onFailure?.(error.message || 'Failed to process order');
      }
    },
    modal: {
      ondismiss: function () {
        onFailure?.('Payment cancelled by user');
      },
      escape: false,
      backdropclose: false,
    },
  };

  try {
    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response) {
      onFailure?.(response.error.description || 'Payment failed');
    });
    razorpay.open();
  } catch (error) {
    onFailure?.(error.message || 'Payment initialization failed');
  }
};

const RazorpayCheckout = () => {
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  return null;
};

export default RazorpayCheckout;