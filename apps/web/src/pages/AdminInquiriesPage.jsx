import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, MessageSquare, Mail, Phone, Clock, CheckCircle, AlertCircle, Search, Zap } from 'lucide-react';
import { getInquiries, updateInquiry, deleteInquiry } from '../lib/db';

const QUICK_REPLIES = [
  { label: "We'll get back shortly", message: "Hi {name}! Thanks for reaching out to Bloom. We've received your inquiry and will get back to you shortly. 🙏" },
  { label: "Reply in 24 hrs", message: "Hi {name}! Thank you for contacting Bloom. We'll respond within 24 hours. We appreciate your patience! 😊" },
  { label: "Order on its way", message: "Hi {name}! Great news — your Bloom order is on its way! Thank you for shopping with us! 🎉" },
  { label: "Need more info", message: "Hi {name}! Could you please share more details about your inquiry so we can assist you better? 🙏" },
  { label: "Item out of stock", message: "Hi {name}! Unfortunately this item is currently out of stock. We'll notify you as soon as it's available! 💛" },
  { label: "Refund processed", message: "Hi {name}! We've processed your refund. It should reflect in 5-7 business days. Sorry for the inconvenience! 🙏" },
];

function openWhatsApp(phone, message) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const withCode = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
  window.open(`https://wa.me/${withCode}?text=${encodeURIComponent(message)}`, '_blank');
}

const STATUS_STYLES = {
  New: 'bg-rouge/10 text-rouge border border-rouge/20',
  'In Progress': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Replied: 'bg-green-50 text-green-700 border border-green-200',
  Closed: 'bg-ink/5 text-ink/60 border border-ink/10',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadInquiries(); }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await getInquiries();
      setInquiries(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiry(id, { status });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await deleteInquiry(id);
      setInquiries(prev => prev.filter(i => i.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e) { console.error(e); }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) { alert('Please enter a message'); return; }
    const newReply = { id: `reply_${Date.now()}`, message: replyMessage, timestamp: new Date().toISOString(), from: 'admin' };
    const updatedReplies = [...(selected.replies || []), newReply];
    try {
      await updateInquiry(selected.id, { replies: updatedReplies, status: 'Replied' });
      const updated = { ...selected, replies: updatedReplies, status: 'Replied' };
      setInquiries(prev => prev.map(i => i.id === selected.id ? updated : i));
      setSelected(updated);
      if (selected.phone) openWhatsApp(selected.phone, replyMessage);
      else alert('Reply saved! No phone number available for WhatsApp.');
      setReplyMessage('');
    } catch (e) { console.error(e); }
  };

  const filtered = inquiries.filter(i => {
    const matchSearch = i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && (filterStatus === 'All' || i.status === filterStatus);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-md text-ink dark:text-cream mb-1">Inquiries</h1>
        <p className="eyebrow text-ink/60 dark:text-cream/60">Manage customer inquiries and reply via WhatsApp</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
              <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 border-ink/10 dark:border-ink/20 text-ink dark:text-cream dark:bg-card" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All','New','In Progress','Replied','Closed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all ${filterStatus === s ? 'bg-rouge text-cream' : 'border border-ink/10 dark:border-ink/20 text-ink dark:text-cream'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {loading ? <p className="text-center text-ink/40 dark:text-cream/40 py-8">Loading…</p> :
              filtered.length === 0 ? <p className="text-center text-ink/40 dark:text-cream/40 py-8">No inquiries</p> :
              filtered.map(inq => (
                <button key={inq.id} onClick={() => { setSelected(inq); setReplyMessage(''); }}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${selected?.id === inq.id ? 'bg-rouge/10 border-rouge dark:bg-rouge/20' : 'bg-background dark:bg-card border-ink/10 dark:border-ink/20 hover:border-rouge/30'}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-sm text-ink dark:text-cream truncate">{inq.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_STYLES[inq.status] || ''}`}>{inq.status}</span>
                  </div>
                  <p className="text-xs text-ink/50 dark:text-cream/50 truncate">{inq.subject}</p>
                  <p className="text-xs text-ink/40 dark:text-cream/40 mt-1">{new Date(inq.created_at).toLocaleDateString()}</p>
                </button>
              ))
            }
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-background dark:bg-card border border-ink/10 dark:border-ink/20 rounded-lg p-6 space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-ink/10 dark:border-ink/20">
                <div>
                  <h2 className="font-display text-2xl text-ink dark:text-cream">{selected.name}</h2>
                  <p className="text-sm text-ink/60 dark:text-cream/60">{selected.email}</p>
                </div>
                <select value={selected.status} onChange={e => handleStatusChange(selected.id, e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium focus:outline-none ${STATUS_STYLES[selected.status] || ''}`}>
                  {['New','In Progress','Replied','Closed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-rouge" />
                  <div><p className="text-xs text-ink/60 dark:text-cream/60">Email</p><p className="text-sm text-ink dark:text-cream">{selected.email}</p></div>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-rouge" />
                    <div><p className="text-xs text-ink/60 dark:text-cream/60">WhatsApp</p>
                      <button onClick={() => openWhatsApp(selected.phone, `Hi ${selected.name}!`)} className="text-sm text-rouge underline">{selected.phone}</button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs eyebrow text-ink/60 dark:text-cream/60 mb-1">SUBJECT</p>
                <p className="text-ink dark:text-cream">{selected.subject}</p>
              </div>
              <div>
                <p className="text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">MESSAGE</p>
                <div className="bg-ink/5 dark:bg-ink/20 rounded p-4 max-h-32 overflow-y-auto">
                  <p className="text-sm text-ink dark:text-cream whitespace-pre-wrap">{selected.message}</p>
                </div>
                <p className="text-xs text-ink/40 dark:text-cream/40 mt-1"><Clock className="h-3 w-3 inline mr-1" />{new Date(selected.created_at).toLocaleString()}</p>
              </div>

              {selected.replies?.length > 0 && (
                <div>
                  <p className="text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">CONVERSATION ({selected.replies.length})</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selected.replies.map(reply => (
                      <div key={reply.id} className="p-3 rounded-lg border-l-4 bg-rouge/5 dark:bg-rouge/10 border-rouge">
                        <p className="text-xs text-ink/60 dark:text-cream/60 mb-1">You</p>
                        <p className="text-sm text-ink dark:text-cream">{reply.message}</p>
                        <p className="text-xs text-ink/40 dark:text-cream/40 mt-1">{new Date(reply.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-ink/10 dark:border-ink/20">
                <div className="flex items-center gap-2 mb-3"><Zap className="h-4 w-4 text-rouge" /><p className="text-xs eyebrow text-ink/60 dark:text-cream/60">QUICK REPLIES</p></div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map(qr => (
                    <button key={qr.label} onClick={() => setReplyMessage(qr.message.replace('{name}', selected.name || 'there'))}
                      className="px-3 py-1.5 text-xs border border-ink/15 dark:border-ink/30 text-ink dark:text-cream rounded-full hover:border-rouge hover:text-rouge transition-all">
                      {qr.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <textarea value={replyMessage} onChange={e => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..." rows="3"
                  className="w-full px-4 py-3 bg-background dark:bg-card border border-ink/10 dark:border-ink/20 text-ink dark:text-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-rouge resize-none" />
                <div className="flex gap-2">
                  <Button onClick={handleSendReply}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white border-none">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.855L0 24l6.272-1.644A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.782 9.782 0 01-5.044-1.399l-.361-.214-3.741.981.998-3.648-.235-.374A9.761 9.761 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                    Send via WhatsApp
                  </Button>
                  <Button onClick={() => handleDelete(selected.id)} variant="outline"
                    className="px-4 border-ink/20 dark:border-ink/30 text-ink dark:text-cream">
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-background dark:bg-card border border-ink/10 dark:border-ink/20 rounded-lg p-12 text-center min-h-96 flex flex-col items-center justify-center">
              <MessageSquare size={48} className="text-ink/20 dark:text-cream/20 mb-4" />
              <p className="text-ink/60 dark:text-cream/60">Select an inquiry to view and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}