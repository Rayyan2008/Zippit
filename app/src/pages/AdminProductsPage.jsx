import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, Edit2, Plus, Package } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    inStock: true,
    featured: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const stored = localStorage.getItem('zippit_products');
    setProducts(stored ? JSON.parse(stored) : []);
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
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill all required fields');
      return;
    }

    if (editingId) {
      const updated = products.map((p) =>
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      setProducts(updated);
      localStorage.setItem('zippit_products', JSON.stringify(updated));
      setEditingId(null);
    } else {
      const newProduct = {
        ...formData,
        id: `product_${Date.now()}`,
      };
      setProducts([...products, newProduct]);
      localStorage.setItem(
        'zippit_products',
        JSON.stringify([...products, newProduct])
      );
    }

    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '',
      inStock: true,
      featured: false,
    });
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem('zippit_products', JSON.stringify(updated));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '',
      inStock: true,
      featured: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-md text-ink mb-1">Products</h1>
          <p className="eyebrow text-ink/60">Manage your product inventory</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-rouge hover:bg-wine text-cream border-none"
        >
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      {/* Add/Edit Product Form */}
      {showForm && (
        <div className="border border-ink/10 bg-white p-8">
          <h2 className="font-display text-lg text-ink mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs eyebrow text-ink/60 mb-2">
                  PRODUCT NAME *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Block Print Pouch"
                  required
                  className="border-ink/15 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs eyebrow text-ink/60 mb-2">
                  PRICE (₹) *
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  className="border-ink/15 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs eyebrow text-ink/60 mb-2">
                  CATEGORY *
                </label>
                <Input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Daily Essentials"
                  required
                  className="border-ink/15 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs eyebrow text-ink/60 mb-2">
                  IMAGE URL
                </label>
                <Input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="border-ink/15 text-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs eyebrow text-ink/60 mb-2">
                DESCRIPTION
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                className="w-full px-3 py-2 border border-ink/15 text-ink focus:outline-none focus:ring-2 focus:ring-rouge/50"
                rows="3"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="w-4 h-4 border-ink/15 text-rouge"
                />
                <span className="text-sm font-medium text-ink">In Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 border-ink/15 text-rouge"
                />
                <span className="text-sm font-medium text-ink">Featured Product</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-rouge hover:bg-wine text-cream border-none">
                {editingId ? 'Update Product' : 'Add Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 border-ink/15 text-ink hover:bg-muted"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="border border-ink/10 bg-white overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-ink/20 mx-auto mb-3" />
            <p className="text-ink/60">No products yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-ink/10 bg-cream">
                <tr>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60">NAME</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60">CATEGORY</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60">PRICE</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60">STATUS</th>
                  <th className="px-6 py-4 text-right text-xs eyebrow text-ink/60">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-ink">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-ink/70">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-ink">₹{product.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 border text-xs font-medium inline-block ${
                          product.inStock
                            ? 'bg-muted/30 text-wine border-wine/30'
                            : 'bg-signal/20 text-signal border-signal/30'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center gap-1 text-rouge hover:text-wine transition-colors"
                        aria-label="Edit product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="inline-flex items-center gap-1 text-signal hover:text-destructive transition-colors"
                        aria-label="Delete product"
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
