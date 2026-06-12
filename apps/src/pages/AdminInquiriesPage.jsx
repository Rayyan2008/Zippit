import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, MessageSquare, Mail, Phone, Clock, CheckCircle, AlertCircle, Search, Zap } from 'lucide-react';

const QUICK_REPLIES = [
  { label: "We'll get back shortly", message: "Hi {name}! Thanks for reaching out to Zippit. We've received your inquiry and will get back to you shortly. 🙏" },
  { label: "Reply in 24 hrs", message: "Hi {name}! Thank you for contacting Zippit. We'll respond to your inquiry within 24 hours. We appreciate your patience! 😊" },
  { label: "Order on its way", message: "Hi {name}! Great news — your Zippit order is on its way! You'll receive it soon. Thank you for shopping with us! 🎉" },
  { label: "Need more info", message: "Hi {name}! Thanks for reaching out. Could you please share more details about your inquiry so we can assist you better? 🙏" },
  { label: "Item out of stock", message: "Hi {name}! Thanks for your interest in our product. Unfortunately this item is currently out of stock. We'll notify you as soon as it's available again! 💛" },
  { label: "Refund processed", message: "Hi {name}! We've processed your refund. It should reflect in your account within 5-7 business days. Sorry for the inconvenience! 🙏" },
];

function openWhatsApp(phone, message) {
  // Clean phone number - remove spaces, dashes, brackets
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Add country code if missing (default India +91)
  const withCode = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${withCode}?text=${encoded}`, '_blank');
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => { loadInquiries(); }, []);

  const loadInquiries = () => {
    const stored = localStorage.getItem('zippit_inquiries');
    setInquiries(stored ? JSON.parse(stored) : []);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = inquiries.map((inq) => inq.id === id ? { ...inq, status: newStatus } : inq);
    setInquiries(updated);
    localStorage.setItem('zippit_inquiries', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      const updated = inquiries.filter((inq) => inq.id !== id);
      setInquiries(updated);
      localStorage.setItem('zippit_inquiries', JSON.stringify(updated));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const handleQuickReply = (template) => {
    const message = template.message.replace('{name}', selectedInquiry?.name || 'there');
    setReplyMessage(message);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) { alert('Please enter a message'); return; }

    // Save reply to history
    const updated = inquiries.map((inq) =>
      inq.id === selectedInquiry.id
        ? {
            ...inq,
            replies: [...(inq.replies || []), {
              id: `reply_${Date.now()}`,
              message: replyMessage,
              timestamp: new Date().toISOString(),
              from: 'admin',
            }],
            status: 'Replied',
          }
        : inq
    );
    setInquiries(updated);
    localStorage.setItem('zippit_inquiries', JSON.stringify(updated));
    setSelectedInquiry(updated.find((inq) => inq.id === selectedInquiry.id));

    // Open WhatsApp if phone number exists
    if (selectedInquiry.phone) {
      openWhatsApp(selectedInquiry.phone, replyMessage);
    } else {
      alert('Reply saved! No phone number available for WhatsApp.');
    }

    setReplyMessage('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New': return <AlertCircle className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Replied': return <CheckCircle className="h-4 w-4" />;
      case 'Closed': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'New': return 'bg-rouge/10 text-rouge border border-rouge/20';
      case 'In Progress': return 'bg-gold/10 text-wine border border-gold/20';
      case 'Replied': return 'bg-blush/10 text-wine border border-blush/20';
      case 'Closed': return 'bg-parchment/10 text-ink dark:text-cream border border-parchment/20';
      default: return 'bg-background text-foreground border border-border';
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || inq.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = ['All', 'New', 'In Progress', 'Replied', 'Closed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-display-md text-ink dark:text-cream mb-1">Inquiries</h1>
        <p className="eyebrow text-ink/60 dark:text-cream/60">Manage customer inquiries and reply via WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 dark:text-cream/40" />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background dark:bg-card border-ink/10 dark:border-ink/20 text-ink dark:text-cream"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-rouge text-cream'
                      : 'bg-background dark:bg-card border border-ink/10 dark:border-ink/20 text-ink dark:text-cream hover:border-rouge/30'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredInquiries.length === 0 ? (
              <div className="bg-background dark:bg-card border border-ink/10 dark:border-ink/20 rounded-lg p-4 text-center text-ink/60 dark:text-cream/60">
                No inquiries found
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <button
                  key={inquiry.id}
                  onClick={() => { setSelectedInquiry(inquiry); setReplyMessage(''); }}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedInquiry?.id === inquiry.id
                      ? 'bg-rouge/10 border-rouge dark:bg-rouge/20'
                      : 'bg-background dark:bg-card border-ink/10 dark:border-ink/20 hover:border-rouge/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-ink dark:text-cream truncate">{inquiry.name}</p>
                      <p className="text-xs text-ink/60 dark:text-cream/60 truncate">{inquiry.subject}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 flex-shrink-0 ${getStatusStyles(inquiry.status)}`}>
                      {getStatusIcon(inquiry.status)}
                    </span>
                  </div>
                  <p className="text-xs text-ink/50 dark:text-cream/50">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <div className="bg-background dark:bg-card border border-ink/10 dark:border-ink/20 rounded-lg p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-ink/10 dark:border-ink/20">
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-2xl text-ink dark:text-cream mb-1">{selectedInquiry.name}</h2>
                  <p className="text-sm text-ink/60 dark:text-cream/60">{selectedInquiry.email}</p>
                </div>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className={`px-3 py-2 rounded-lg border font-medium text-sm ${getStatusStyles(selectedInquiry.status)} focus:outline-none focus:ring-2 focus:ring-rouge`}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Replied">Replied</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-rouge flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-ink/60 dark:text-cream/60 mb-1">Email</p>
                    <p className="text-sm text-ink dark:text-cream truncate">{selectedInquiry.email}</p>
                  </div>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-rouge flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-ink/60 dark:text-cream/60 mb-1">WhatsApp</p>
                      <button
                        onClick={() => openWhatsApp(selectedInquiry.phone, `Hi ${selectedInquiry.name}!`)}
                        className="text-sm text-rouge hover:text-wine underline"
                      >
                        {selectedInquiry.phone}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject + Message */}
              <div>
                <p className="text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">SUBJECT</p>
                <p className="text-base text-ink dark:text-cream">{selectedInquiry.subject}</p>
              </div>
              <div>
                <p className="text-xs eyebrow text-ink/60 dark:text-cream/60 mb-2">MESSAGE</p>
                <div className="bg-background dark:bg-card/50 border border-ink/5 dark:border-ink/20 rounded p-4 max-h-32 overflow-y-auto">
                  <p className="text-sm text-ink dark:text-cream whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
                <p className="text-xs text-ink/50 dark:text-cream/50 mt-2">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Reply History */}
              {selectedInquiry.replies && selectedInquiry.replies.length > 0 && (
                <div>
                  <p className="text-xs eyebrow text-ink/60 dark:text-cream/60 mb-3">CONVERSATION ({selectedInquiry.replies.length})</p>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedInquiry.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-4 rounded-lg border-l-4 bg-rouge/5 dark:bg-rouge/10 border-rouge"
                      >
                        <p className="text-xs font-semibold text-ink/60 dark:text-cream/60 mb-1">You</p>
                        <p className="text-sm text-ink dark:text-cream">{reply.message}</p>
                        <p className="text-xs text-ink/40 dark:text-cream/40 mt-2">{new Date(reply.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Replies */}
              <div className="pt-4 border-t border-ink/10 dark:border-ink/20">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-rouge" />
                  <p className="text-xs eyebrow text-ink/60 dark:text-cream/60">QUICK REPLIES</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr.label}
                      onClick={() => handleQuickReply(qr)}
                      className="px-3 py-1.5 text-xs font-medium border border-ink/15 dark:border-ink/30 text-ink dark:text-cream rounded-full hover:border-rouge hover:text-rouge transition-all"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <div className="space-y-3">
                <p className="text-xs eyebrow text-ink/60 dark:text-cream/60">REPLY MESSAGE</p>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply or pick a quick reply above..."
                  className="w-full px-4 py-3 bg-background dark:bg-card border border-ink/10 dark:border-ink/20 text-ink dark:text-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-rouge resize-none"
                  rows="3"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSendReply}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white border-none"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.855L0 24l6.272-1.644A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.782 9.782 0 01-5.044-1.399l-.361-.214-3.741.981.998-3.648-.235-.374A9.761 9.761 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                    Send via WhatsApp
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    variant="outline"
                    className="px-4 flex items-center gap-2 border-ink/20 dark:border-ink/30 text-ink dark:text-cream"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-background dark:bg-card border border-ink/10 dark:border-ink/20 rounded-lg p-12 text-center flex flex-col items-center justify-center min-h-96">
              <MessageSquare size={48} className="mx-auto mb-4 text-ink/20 dark:text-cream/20" />
              <p className="text-ink/60 dark:text-cream/60">Select an inquiry to view details and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}