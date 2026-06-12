import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Trash2, Eye } from 'lucide-react';
import { sendOrderStatusNotification } from '../services/whatsapp';

const ORDER_STATUSES = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const stored = localStorage.getItem('zippit_orders');
    setOrders(stored ? JSON.parse(stored) : []);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = orders.map((order) =>
      order.id === id
        ? {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : order
    );
    setOrders(updated);
    localStorage.setItem('zippit_orders', JSON.stringify(updated));

    // Update selected order
    if (selectedOrder?.id === id) {
      setSelectedOrder(updated.find((o) => o.id === id));
    }

    // Send WhatsApp notification if phone is available
    const order = updated.find((o) => o.id === id);
    if (order?.phone) {
      sendOrderStatusNotification(order.phone, order.id, newStatus)
        .then((result) => {
          if (result.success) {
            console.log('WhatsApp notification sent for order status update');
          } else {
            console.error('WhatsApp notification failed:', result.error);
          }
        });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      const updated = orders.filter((order) => order.id !== id);
      setOrders(updated);
      localStorage.setItem('zippit_orders', JSON.stringify(updated));
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.includes(searchQuery) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'In Transit':
      case 'Out for Delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIndex = (status) => ORDER_STATUSES.indexOf(status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Orders List */}
      <div className="lg:col-span-1">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Orders</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, email, or name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                No orders found
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedOrder?.id === order.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">Order #{order.id.slice(-6)}</p>
                      <p className="text-xs text-gray-600 truncate">{order.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{order.total.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="lg:col-span-2">
        {selectedOrder ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">Order #{selectedOrder.id}</h3>
                <p className="text-gray-600">{selectedOrder.email}</p>
              </div>
              <Button
                onClick={() => handleDelete(selectedOrder.id)}
                variant="destructive"
              >
                Delete
              </Button>
            </div>

            {/* Customer Info */}
            <div className="mb-6 pb-4 border-b grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-600">CUSTOMER NAME</p>
                <p className="text-sm">{selectedOrder.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">EMAIL</p>
                <p className="text-sm">{selectedOrder.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">PHONE</p>
                <p className="text-sm">{selectedOrder.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">ORDER DATE</p>
                <p className="text-sm">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6 pb-4 border-b">
              <h4 className="font-semibold mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-700">{selectedOrder.address || 'N/A'}</p>
              <p className="text-sm text-gray-700">
                {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip}
              </p>
            </div>

            {/* Order Items */}
            <div className="mb-6 pb-4 border-b">
              <h4 className="font-semibold mb-3">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.total}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items</p>
                )}
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="mb-6 pb-4 border-b">
              <h4 className="font-semibold mb-3">Status Progress</h4>
              <div className="space-y-2">
                {ORDER_STATUSES.map((status, index) => (
                  <div
                    key={status}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
                    onClick={() => handleStatusChange(selectedOrder.id, status)}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        getStatusIndex(selectedOrder.status) >= index
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                    <span
                      className={`text-sm ${
                        getStatusIndex(selectedOrder.status) >= index
                          ? 'font-semibold text-gray-900'
                          : 'text-gray-600'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Click on a status to update
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>₹{(selectedOrder.total - (selectedOrder.tax || 0)).toLocaleString()}</span>
              </div>
              {selectedOrder.tax && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span>₹{selectedOrder.tax.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Eye size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Select an order to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
