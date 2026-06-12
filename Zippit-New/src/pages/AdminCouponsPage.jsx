import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    maxUses: '',
    expiryDate: '',
    active: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    const stored = localStorage.getItem('zippit_coupons');
    setCoupons(stored ? JSON.parse(stored) : []);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercent) {
      alert('Coupon code and discount are required');
      return;
    }

    if (editingId) {
      const updated = coupons.map((c) =>
        c.id === editingId ? { ...formData, id: editingId } : c
      );
      setCoupons(updated);
      localStorage.setItem('zippit_coupons', JSON.stringify(updated));
      setEditingId(null);
    } else {
      const newCoupon = {
        ...formData,
        id: `coupon_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setCoupons([...coupons, newCoupon]);
      localStorage.setItem(
        'zippit_coupons',
        JSON.stringify([...coupons, newCoupon])
      );
    }

    setFormData({
      code: '',
      discountPercent: '',
      maxUses: '',
      expiryDate: '',
      active: true,
    });
    setShowForm(false);
  };

  const handleEdit = (coupon) => {
    setFormData(coupon);
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      const updated = coupons.filter((c) => c.id !== id);
      setCoupons(updated);
      localStorage.setItem('zippit_coupons', JSON.stringify(updated));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      code: '',
      discountPercent: '',
      maxUses: '',
      expiryDate: '',
      active: true,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-foreground">Coupons</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Add Coupon
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Coupon' : 'Add New Coupon'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code *
              </label>
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., SUMMER20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount % *
              </label>
              <Input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleInputChange}
                placeholder="20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Uses
              </label>
              <Input
                type="number"
                name="maxUses"
                value={formData.maxUses}
                onChange={handleInputChange}
                placeholder="Unlimited"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <Input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update Coupon' : 'Add Coupon'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {coupons.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No coupons yet. Add one to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Expiry</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{coupon.code}</td>
                    <td className="px-6 py-4 text-sm">{coupon.discountPercent}%</td>
                    <td className="px-6 py-4 text-sm">
                      {coupon.expiryDate || 'No expiry'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          coupon.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
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
