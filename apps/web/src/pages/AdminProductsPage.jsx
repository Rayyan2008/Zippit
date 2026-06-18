import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, Edit2, Plus, Package, Upload } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImageToStorage } from '../lib/db';


const CATEGORIES = ['Handbags', 'Pouches', 'Scrunchies', 'Accessories'];

const EMPTY_FORM = {
  title: '', subtitle: '', description: '', category: 'Handbags',
  price: '', sale_price: '', stock_quantity: '', ribbon_text: '',
  image: '', is_featured: false, is_active: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({});
      setProducts(data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      setError('Only JPG images are allowed');
      return;
    }

    setError(null);
    setSelectedImageFile(file);
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadProductImageToStorage(file, { productId: editingId });
      // Override URL field so submit uses the uploaded image.
      setFormData(prev => ({ ...prev, image: uploadedUrl }));
    } catch (err) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      alert('Please fill all required fields'); return;
    }
    setSaving(true); setError(null);
    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        category: formData.category,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        stock_quantity: Number(formData.stock_quantity) || 0,
        ribbon_text: formData.ribbon_text || null,
        image: formData.image || null,
        is_featured: !!formData.is_featured,
        is_active: !!formData.is_active,
      };


      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        setProducts(prev => prev.map(p => p.id === editingId ? updated : p));
      } else {
        const created = await createProduct(payload);
        setProducts(prev => [created, ...prev]);
      }
      setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title || '',
      subtitle: product.subtitle || '',
      description: product.description || '',
      category: product.category || 'Daily Essentials',
      price: product.price || '',
      sale_price: product.sale_price || '',
      stock_quantity: product.stock_quantity || '',
      ribbon_text: product.ribbon_text || '',
      image: product.image || '',
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
    });
    setEditingId(product.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await deleteProduct(id); setProducts(prev => prev.filter(p => p.id !== id)); }
    catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-md text-ink dark:text-cream mb-1">Products</h1>
          <p className="eyebrow text-ink/60 dark:text-cream/60">Manage your product inventory</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(EMPTY_FORM); }}
          className="flex items-center gap-2 bg-rouge hover:bg-wine text-cream border-none">
          <Plus size={20} /> Add Product
        </Button>
      </div>

      {error && <div className="bg-rouge/10 border border-rouge/20 text-rouge px-4 py-3 text-sm">{error}</div>}

      {showForm && (
        <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-8">
          <h2 className="font-display text-lg text-ink dark:text-cream mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">PRODUCT NAME *</label>
                <Input name="title" value={formData.title} onChange={handleInputChange}
                  placeholder="e.g., Block Print Pouch" required className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
              </div>
              <div>
                <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">SUBTITLE</label>
                <Input name="subtitle" value={formData.subtitle} onChange={handleInputChange}
                  placeholder="Short tagline" className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
              </div>
              <div>
                <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">CATEGORY *</label>
                <select name="category" value={formData.category} onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-ink/15 dark:border-ink/30 bg-background dark:bg-card text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-rouge/50">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">MRP (₹) *</label>
                <Input type="number" name="price" value={formData.price} onChange={handleInputChange}
                  placeholder="0" required className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
              </div>
              <div>
                <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">SALE PRICE (₹)</label>
                <Input type="number" name="sale_price" value={formData.sale_price} onChange={handleInputChange}
                  placeholder="Leave empty if no sale" className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
              </div>
              <div>
                <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">STOCK QUANTITY</label>
                <Input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange}
                  placeholder="0" className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
              </div>
              <div>
                <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">IMAGE (JPG)</label>
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg"
                  onChange={handleImageFileChange}
                  className="border-ink/15 text-ink dark:text-cream dark:bg-card"
                />
                {uploadingImage && (
                  <div className="mt-2 text-xs text-ink/60 dark:text-cream/60">Uploading…</div>
                )}
                <div className="mt-4">
                  <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">OR IMAGE URL</label>
                  <Input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="border-ink/15 text-ink dark:text-cream dark:bg-card"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">RIBBON TEXT</label>
                <Input name="ribbon_text" value={formData.ribbon_text} onChange={handleInputChange}
                  placeholder="e.g., New, Bestseller" className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
              </div>
            </div>
            <div>
              <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">DESCRIPTION</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange}
                placeholder="Describe your product..." rows="3"
                className="w-full px-3 py-2 border border-ink/15 dark:border-ink/30 bg-background dark:bg-card text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-rouge/50" />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} className="w-4 h-4" />
                <span className="text-sm text-ink dark:text-cream">Featured Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="w-4 h-4" />
                <span className="text-sm text-ink dark:text-cream">Active (visible on shop)</span>
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1 bg-rouge hover:bg-wine text-cream border-none">
                {saving ? 'Saving…' : editingId ? 'Update Product' : 'Add Product'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); }}
                className="flex-1 border-ink/15 dark:border-ink/30 text-ink dark:text-cream">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink/40 dark:text-cream/40">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-ink/20 dark:text-cream/20 mx-auto mb-3" />
            <p className="text-ink/60 dark:text-cream/60">No products yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-ink/10 dark:border-ink/20 bg-cream dark:bg-card/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">NAME</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">CATEGORY</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">PRICE</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">STOCK</th>
                  <th className="px-6 py-4 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">STATUS</th>
                  <th className="px-6 py-4 text-right text-xs eyebrow text-ink/60 dark:text-cream/60">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 dark:divide-ink/20">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-cream/50 dark:hover:bg-card/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image && <img src={product.image} alt={product.title} className="w-10 h-10 object-cover" />}
                        <div>
                          <p className="text-sm font-medium text-ink dark:text-cream">{product.title}</p>
                          {product.subtitle && <p className="text-xs text-ink/50 dark:text-cream/50">{product.subtitle}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink/70 dark:text-cream/70">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-ink dark:text-cream">
                      ₹{product.price}
                      {product.sale_price && <span className="ml-2 text-rouge text-xs">Sale: ₹{product.sale_price}</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-ink dark:text-cream">{product.stock_quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 border text-xs font-medium inline-block ${product.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-rouge/10 text-rouge border-rouge/20'}`}>
                        {product.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleEdit(product)} className="text-rouge hover:text-wine transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(product.id)} className="text-ink/40 hover:text-rouge transition-colors"><Trash2 size={16} /></button>
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