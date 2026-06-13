/**
 * Test Orders API Endpoint
 * 
 * Usage:
 * POST /api/test/create-order
 * Body: { customer_name, customer_email, customer_phone, total, status }
 * 
 * Or simply POST to /api/test/create-orders?count=5 to create 5 random orders
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

export async function handleTestOrderRequest(req, res) {
  try {
    // POST /api/test/create-orders?count=5
    if (req.url.includes('create-orders')) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const count = parseInt(url.searchParams.get('count') || '5');
      
      const orders = [];
      for (let i = 0; i < count; i++) {
        const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const total = product.price * quantity;
        
        const order = await createOrder({
          customer_name: `Test Customer ${i + 1}`,
          customer_email: `customer${i + 1}@test.com`,
          customer_phone: `9${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
          total: total,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          shipping_address: {
            address: `${Math.floor(Math.random() * 999) + 1} Test Street`,
            city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'][Math.floor(Math.random() * 5)],
            state: ['MH', 'DL', 'KA', 'MH', 'TN'][Math.floor(Math.random() * 5)],
            pincode: String(Math.floor(Math.random() * 900000) + 100000),
          },
          items: [{
            product_name: product.name,
            quantity: quantity,
            price: product.price,
            total: total,
          }],
          payment_method: 'razorpay',
          razorpay_payment_id: `pay_test_${Math.random().toString(36).substr(2, 9)}`,
        });
        
        orders.push(order);
      }
      
      res.json({ success: true, created: count, orders });
      return;
    }
    
    // POST /api/test/create-order with custom data
    if (req.url.includes('create-order')) {
      const body = req.body;
      const order = await createOrder({
        customer_name: body.customer_name || 'Test Customer',
        customer_email: body.customer_email || 'test@example.com',
        customer_phone: body.customer_phone || '9999999999',
        total: body.total || 500,
        status: body.status || 'Confirmed',
        shipping_address: body.shipping_address || {
          address: '123 Test Street',
          city: 'Mumbai',
          state: 'MH',
          pincode: '400001',
        },
        items: body.items || [{
          product_name: 'Test Product',
          quantity: 1,
          price: body.total || 500,
          total: body.total || 500,
        }],
        payment_method: 'razorpay',
        razorpay_payment_id: `pay_test_${Math.random().toString(36).substr(2, 9)}`,
      });
      
      res.json({ success: true, order });
      return;
    }
    
    res.json({ error: 'Unknown test endpoint' });
  } catch (error) {
    console.error('Test order error:', error);
    res.status(500).json({ error: error.message });
  }
}
