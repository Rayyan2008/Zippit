/**
 * TEST ORDERS UTILITY
 * Use this to insert test orders directly into Supabase for dashboard testing.
 * 
 * Usage in browser console:
 * 1. Open admin dashboard in browser
 * 2. Paste this file's contents into DevTools Console
 * 3. Run: insertTestOrders() to create 5 sample orders
 * 4. Refresh the Orders page to see them
 */

import { createOrder } from '../lib/db.js';

const sampleProducts = [
  { name: 'Canvas School Bag', price: 899 },
  { name: 'Block Print Pouch', price: 499 },
  { name: 'Ethnic Coin Purse', price: 299 },
  { name: 'Travel Organizer', price: 1299 },
  { name: 'Makeup Organizer', price: 599 },
];

const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export async function insertTestOrders(count = 5) {
  console.log(`🧪 Creating ${count} test orders...`);
  
  try {
    for (let i = 0; i < count; i++) {
      const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const total = product.price * quantity;
      
      // Create order with realistic data
      const order = {
        customer_name: `Test Customer ${i + 1}`,
        customer_email: `customer${i + 1}@example.com`,
        customer_phone: `9${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
        total: total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        shipping_address: {
          address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
          city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'][Math.floor(Math.random() * 5)],
          state: ['MH', 'DL', 'KA', 'MH', 'TN'][Math.floor(Math.random() * 5)],
          pincode: String(Math.floor(Math.random() * 900000) + 100000),
        },
        items: [
          {
            product_name: product.name,
            quantity: quantity,
            price: product.price,
            total: total,
          }
        ],
        payment_method: 'razorpay',
        razorpay_payment_id: `pay_test_${Math.random().toString(36).substr(2, 9)}`,
      };
      
      const created = await createOrder(order);
      console.log(`✅ Order ${i + 1}/${count} created:`, created.id, `(${created.order_number})`);
    }
    
    console.log(`\n🎉 All ${count} test orders created successfully!`);
    console.log('📊 Refresh the Orders page to see them in the dashboard.');
    return true;
  } catch (error) {
    console.error('❌ Error creating test orders:', error);
    return false;
  }
}

// Helper to create a single test order with custom data
export async function createSingleTestOrder(customerName, email, phone, total, status = 'Confirmed') {
  try {
    const order = {
      customer_name: customerName,
      customer_email: email,
      customer_phone: phone,
      total: total,
      status: status,
      shipping_address: {
        address: '123 Test Street',
        city: 'Mumbai',
        state: 'MH',
        pincode: '400001',
      },
      items: [
        {
          product_name: 'Test Product',
          quantity: 1,
          price: total,
          total: total,
        }
      ],
      payment_method: 'razorpay',
      razorpay_payment_id: `pay_test_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const created = await createOrder(order);
    console.log('✅ Test order created:', created);
    return created;
  } catch (error) {
    console.error('❌ Error creating test order:', error);
    throw error;
  }
}

console.log('📋 Test Orders Utility Loaded!');
console.log('Commands available:');
console.log('  • insertTestOrders()              - Create 5 random test orders');
console.log('  • insertTestOrders(10)            - Create 10 test orders');
console.log('  • createSingleTestOrder(...)      - Create a custom test order');
