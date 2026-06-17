# Testing Orders Without Real Razorpay

## Current State

Orders are **not** automatically saved to the dashboard yet. Currently:
- ✅ Orders are created in localStorage after Razorpay payment
- ❌ Orders are NOT saved to Supabase (database)
- ❌ Admin dashboard can't see them

## How to Test Orders Now

### Option 1: Manually Insert Test Orders (Recommended)

**Step 1:** Import and run the test utility  
Open your browser console (F12) while logged into the admin panel, then paste:

```javascript
import { createOrder } from '/src/lib/db.js';

// Create a single test order
const order = await createOrder({
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  customer_phone: '9876543210',
  total: 1299,
  status: 'Confirmed',
  shipping_address: {
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'MH',
    pincode: '400001',
  },
  items: [{
    product_name: 'Canvas School Bag',
    quantity: 1,
    price: 1299,
    total: 1299,
  }],
  payment_method: 'razorpay',
  razorpay_payment_id: 'pay_test_123456',
});

console.log('✅ Order created:', order);
```

**Step 2:** Refresh the admin Orders page  
You should now see the test order in the dashboard.

### Option 2: Create Multiple Test Orders

Paste this in console to create 5 random orders:

```javascript
import { createOrder } from '/src/lib/db.js';

const products = [
  { name: 'Canvas School Bag', price: 899 },
  { name: 'Block Print Pouch', price: 499 },
  { name: 'Ethnic Coin Purse', price: 299 },
];

const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

for (let i = 0; i < 5; i++) {
  const product = products[Math.floor(Math.random() * products.length)];
  const qty = Math.floor(Math.random() * 3) + 1;
  const total = product.price * qty;
  
  await createOrder({
    customer_name: `Customer ${i + 1}`,
    customer_email: `customer${i + 1}@test.com`,
    customer_phone: `98765432${String(i).padStart(2, '0')}`,
    total: total,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    shipping_address: {
      address: `${i + 1} Test Street`,
      city: 'Mumbai',
      state: 'MH',
      pincode: '400001',
    },
    items: [{
      product_name: product.name,
      quantity: qty,
      price: product.price,
      total: total,
    }],
    payment_method: 'razorpay',
    razorpay_payment_id: `pay_test_${i}_${Date.now()}`,
  });
  
  console.log(`✅ Order ${i + 1} created`);
}
```

## Next: Fix Real Order Creation

**To save orders from real checkout**, update [apps/web/src/components/RazorpayCheckout.jsx](apps/web/src/components/RazorpayCheckout.jsx):

```javascript
// In the handler function, after successful payment:
handler: async function (response) {
  // Save to Supabase (not just localStorage)
  const order = await createOrder({
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    total: amount,
    status: 'Confirmed', // or 'Pending'
    payment_method: 'razorpay',
    razorpay_payment_id: response.razorpay_payment_id,
    shipping_address: {}, // Add from checkout form
    items: [], // Add from cart
  });
  
  onSuccess?.(order);
}
```

## Order Schema (Supabase)

Expected fields in `orders` table:
```javascript
{
  id: 'uuid',
  order_number: 'ORD-1234567890', // Auto-generated
  customer_name: string,
  customer_email: string,
  customer_phone: string,
  total: number,
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
  shipping_address: {
    address: string,
    city: string,
    state: string,
    pincode: string,
  },
  items: array, // Order line items
  payment_method: string,
  razorpay_payment_id: string,
  created_at: timestamp,
  updated_at: timestamp,
}
```

## Verify Orders in Dashboard

1. Go to Admin → Orders
2. Search for order number (ORD-xxx)
3. Change status to track order lifecycle
4. View detailed order info on the right panel

## Query Orders Directly

Check Supabase SQL Editor:
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

This shows all orders with timestamps and status.
