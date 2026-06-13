import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../lib/db';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState(null);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setLoading(true);
    try { const data = await getCategories(); setCategories(data); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) { alert('Category name is required'); return; }
    try {
      if (editingId) {
        const updated = await updateCategory(editingId, formData);
        setCategories(prev => prev.map(c => c.id === editingId ? updated : c));
      } else {
        const created = await createCategory(formData);
        setCategories(prev => [...prev, created]);
      }
      setShowForm(false); setEditingId(null); setFormData({ name: '', description: '' });
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await deleteCategory(id); setCategories(prev => prev.filter(c => c.id !== id)); }
    catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-md text-ink dark:text-cream mb-1">Categories</h1>
          <p className="eyebrow text-ink/60 dark:text-cream/60">Manage product categories</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-rouge hover:bg-wine text-cream border-none">
          <Plus size={20} /> Add Category
        </Button>
      </div>

      {error && <div className="bg-rouge/10 border border-rouge/20 text-rouge px-4 py-3 text-sm">{error}</div>}

      {showForm && (
        <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-6">
          <h2 className="font-display text-lg text-ink dark:text-cream mb-4">{editingId ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">NAME *</label>
              <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Daily Essentials" required className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
            </div>
            <div>
              <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">DESCRIPTION</label>
              <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Category description" rows="3"
                className="w-full px-3 py-2 border border-ink/15 dark:border-ink/30 bg-background dark:bg-card text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-rouge/50" />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-rouge hover:bg-wine text-cream border-none">{editingId ? 'Update' : 'Add'} Category</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', description: '' }); }}
                className="flex-1 border-ink/15 dark:border-ink/30 text-ink dark:text-cream">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="col-span-full text-center text-ink/40 dark:text-cream/40 py-12">Loading…</p> :
          categories.length === 0 ? <p className="col-span-full text-center text-ink/60 dark:text-cream/60 py-12">No categories yet.</p> :
          categories.map(cat => (
            <div key={cat.id} className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-5">
              <h3 className="font-display text-lg text-ink dark:text-cream mb-1">{cat.name}</h3>
              <p className="text-sm text-ink/60 dark:text-cream/60 mb-4">{cat.description}</p>
              <div className="flex gap-2">
                <button onClick={() => { setFormData({ name: cat.name, description: cat.description || '' }); setEditingId(cat.id); setShowForm(true); }}
                  className="flex-1 py-2 px-3 border border-rouge text-rouge text-sm hover:bg-rouge hover:text-cream transition-colors flex items-center justify-center gap-1">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(cat.id)}
                  className="flex-1 py-2 px-3 border border-ink/20 dark:border-ink/30 text-ink dark:text-cream text-sm hover:border-rouge hover:text-rouge transition-colors flex items-center justify-center gap-1">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}