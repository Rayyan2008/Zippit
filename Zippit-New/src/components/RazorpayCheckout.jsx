import React, { useEffect } from 'react';

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
    name: 'Zippit',
    description: 'Handmade Ethnic Pouches',
    image: '/logo.png',
    prefill: {
      name: customerName || '',
      email: customerEmail || '',
      contact: customerPhone || '',
    },
    theme: {
      color: '#d94350',
    },
    handler: function (response) {
      const orderData = {
        razorpay_payment_id: response.razorpay_payment_id,
        amount: amount,
        currency: currency,
        timestamp: new Date().toISOString(),
        customerName,
        customerEmail,
        customerPhone,
        status: 'success',
      };

      const existingOrders = JSON.parse(localStorage.getItem('zippit_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('zippit_orders', JSON.stringify(existingOrders));
      localStorage.setItem('zippit_last_order', JSON.stringify(orderData));

      onSuccess?.(orderData);
    },
    modal: {
      ondismiss: function () {
        onFailure?.('Payment cancelled by user');
      },
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