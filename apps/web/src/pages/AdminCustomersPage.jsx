import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Search, Users } from 'lucide-react';
import { getCustomers } from '../lib/db';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getCustomers().then(data => { setCustomers(data); setLoading(false); }).catch(e => { console.error(e); setLoading(false); });
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-md text-ink dark:text-cream mb-1">Customers</h1>
        <p className="eyebrow text-ink/60 dark:text-cream/60">Customers derived from order history</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
        <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search customers..."
          className="pl-9 border-ink/15 text-ink dark:text-cream dark:bg-card" />
      </div>
      <div className="border border-ink/10 dark:border-ink/20 bg-background dark:bg-card overflow-hidden">
        {loading ? <div className="p-12 text-center text-ink/40 dark:text-cream/40">Loading…</div> :
          filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-ink/20 dark:text-cream/20 mx-auto mb-3" />
              <p className="text-ink/60 dark:text-cream/60">No customers yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-ink/10 dark:border-ink/20 bg-cream dark:bg-card/50">
                <tr>
                  {['NAME','EMAIL','PHONE','ORDERS','TOTAL SPENT'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs eyebrow text-ink/60 dark:text-cream/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 dark:divide-ink/20">
                {filtered.map(c => (
                  <tr key={c.email} className="hover:bg-cream/50 dark:hover:bg-card/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-ink dark:text-cream">{c.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-ink/70 dark:text-cream/70">{c.email}</td>
                    <td className="px-6 py-4 text-sm text-ink/70 dark:text-cream/70">{c.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-ink dark:text-cream">{c.orderCount}</td>
                    <td className="px-6 py-4 text-sm font-medium text-ink dark:text-cream">₹{c.totalSpent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  );
}