import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Trash2, Search, Users } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load customers from orders in localStorage
    const orders = JSON.parse(localStorage.getItem('zippit_orders') || '[]');
    const uniqueCustomers = Array.from(
      new Map(
        orders.map((order) => [
          order.email,
          {
            id: order.id,
            name: order.customerName,
            email: order.email,
            phone: order.phone,
            orderCount: orders.filter((o) => o.email === order.email).length,
            totalSpent: orders
              .filter((o) => o.email === order.email)
              .reduce((sum, o) => sum + (o.total || 0), 0),
          },
        ])
      ).values()
    );
    setCustomers(uniqueCustomers);
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-display-md text-ink mb-1">Customers</h1>
        <p className="eyebrow text-ink/60">Manage your customer list</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-ink/40" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-ink/15 text-ink"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="border border-ink/10 bg-white overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-ink/20 mx-auto mb-3" />
            <p className="text-ink/60">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-ink/10 bg-cream">
                <tr>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60">NAME</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60">EMAIL</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60">PHONE</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60">ORDERS</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60">TOTAL SPENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-ink">{customer.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-ink/70">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-ink/70">{customer.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-ink">{customer.orderCount}</td>
                    <td className="px-6 py-4 text-sm font-medium text-ink">₹{customer.totalSpent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
