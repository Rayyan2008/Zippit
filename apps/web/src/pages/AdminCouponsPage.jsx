import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../lib/db';

const EMPTY_FORM = { code: '', type: 'percentage', value: '', min_order: '', max_uses: '', expires_at: '', is_active: true };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try { const data = await getCoupons(); setCoupons(data); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) { alert('Code and value are required'); return; }
    try {
      const payload = { ...formData, value: Number(formData.value), min_order: Number(formData.min_order) || 0, max_uses: formData.max_uses ? Number(formData.max_uses) : null, expires_at: formData.expires_at || null };
      if (editingId) {
        const updated = await updateCoupon(editingId, payload);
        setCoupons(prev => prev.map(c => c.id === editingId ? updated : c));
      } else {
        const created = await createCoupon(payload);
        setCoupons(prev => [created, ...prev]);
      }
      setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM);
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try { await deleteCoupon(id); setCoupons(prev => prev.filter(c => c.id !== id)); }
    catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-md text-ink dark:text-cream mb-1">Coupons</h1>
          <p className="eyebrow text-ink/60 dark:text-cream/60">Manage discount coupons</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-rouge hover:bg-wine text-cream border-none">
          <Plus size={20} /> Add Coupon
        </Button>
      </div>

      {error && <div className="bg-rouge/10 border border-rouge/20 text-rouge px-4 py-3 text-sm">{error}</div>}

      {showForm && (
        <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card p-6">
          <h2 className="font-display text-lg text-ink dark:text-cream mb-4">{editingId ? 'Edit Coupon' : 'Add Coupon'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">COUPON CODE *</label>
              <Input value={formData.code} onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., BLOOM10" required className="border-ink/15 text-ink dark:text-cream dark:bg-card font-mono" />
            </div>
            <div>
              <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">TYPE</label>
              <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 border border-ink/15 dark:border-ink/30 bg-background dark:bg-card text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-rouge/50">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">VALUE *</label>
              <Input type="number" value={formData.value} onChange={e => setFormData(p => ({ ...p, value: e.target.value }))}
                placeholder={formData.type === 'percentage' ? '10 (for 10%)' : '50 (for ₹50)'} required className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
            </div>
            <div>
              <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">MIN ORDER (₹)</label>
              <Input type="number" value={formData.min_order} onChange={e => setFormData(p => ({ ...p, min_order: e.target.value }))}
                placeholder="0" className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
            </div>
            <div>
              <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">MAX USES</label>
              <Input type="number" value={formData.max_uses} onChange={e => setFormData(p => ({ ...p, max_uses: e.target.value }))}
                placeholder="Unlimited" className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
            </div>
            <div>
              <label className="block text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">EXPIRY DATE</label>
              <Input type="date" value={formData.expires_at} onChange={e => setFormData(p => ({ ...p, expires_at: e.target.value }))}
                className="border-ink/15 text-ink dark:text-cream dark:bg-card" />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4" />
                <span className="text-sm text-ink dark:text-cream">Active</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit" className="flex-1 bg-rouge hover:bg-wine text-cream border-none">{editingId ? 'Update' : 'Add'} Coupon</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); }}
                className="flex-1 border-ink/15 dark:border-ink/30 text-ink dark:text-cream">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card overflow-hidden">
        {loading ? <div className="p-12 text-center text-ink/40 dark:text-cream/40">Loading…</div> :
          coupons.length === 0 ? <div className="p-12 text-center text-ink/60 dark:text-cream/60">No coupons yet.</div> : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-ink/10 dark:border-ink/20 bg-cream dark:bg-card/50">
              <tr>
                {['CODE','TYPE','VALUE','MIN ORDER','EXPIRY','STATUS','ACTIONS'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 dark:divide-ink/20">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-cream/50 dark:hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm font-medium text-ink dark:text-cream">{c.code}</td>
                  <td className="px-4 py-3 text-sm text-ink/70 dark:text-cream/70 capitalize">{c.type}</td>
                  <td className="px-4 py-3 text-sm text-ink dark:text-cream">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td className="px-4 py-3 text-sm text-ink/70 dark:text-cream/70">₹{c.min_order || 0}</td>
                  <td className="px-4 py-3 text-sm text-ink/70 dark:text-cream/70">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs border font-medium ${c.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-rouge/10 text-rouge border-rouge/20'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-3">
                    <button onClick={() => { setFormData({ code: c.code, type: c.type, value: c.value, min_order: c.min_order, max_uses: c.max_uses, expires_at: c.expires_at?.split('T')[0] || '', is_active: c.is_active }); setEditingId(c.id); setShowForm(true); }} className="text-rouge hover:text-wine"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(c.id)} className="text-ink/40 hover:text-rouge"><Trash2 size={16} /></button>
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