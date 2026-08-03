import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import AdminPanel from './components/AdminPanel';
import { 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Search, 
  Key, 
  Phone, 
  FileText, 
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const DEFAULT_PAYMENTS = [
  { id: 'qris', name: 'QRIS All Payment', account_number: '-', account_name: 'Golrox Store', qris_image: 'https://via.placeholder.com/300?text=QRIS+CODE', is_maintenance: false, is_archived: false },
  { id: 'dana', name: 'DANA Instant', account_number: '089527732022', account_name: 'Golrox Store', qris_image: '', is_maintenance: false, is_archived: false },
  { id: 'gopay', name: 'GoPay', account_number: '089527732022', account_name: 'Golrox Store', qris_image: '', is_maintenance: false, is_archived: false },
  { id: 'bca', name: 'Transfer Bank BCA', account_number: '1234567890', account_name: 'Golrox Store', qris_image: '', is_maintenance: false, is_archived: false }
];

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  // Form Input
  const [robloxUsername, setRobloxUsername] = useState('');
  const [robloxPassword, setRobloxPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState('qris');
  
  // Tracking & Detail Modal State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userInvoices, setUserInvoices] = useState([]);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState(null);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchPaymentSettings();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').eq('is_archived', false).order('created_at', { ascending: false });
    if (data && data.length > 0) setProducts(data);
  }

  async function fetchPaymentSettings() {
    const { data } = await supabase.from('payment_settings').select('*');
    if (data && data.length > 0) {
      setPayments(data);
      const firstActive = data.find(p => !p.is_archived && !p.is_maintenance);
      if (firstActive) setSelectedPaymentId(firstActive.id);
    } else {
      setPayments(DEFAULT_PAYMENTS);
    }
  }

  async function handleSearchInvoices(query) {
    if (!query.trim()) return;
    const cleanQuery = query.trim();

    const { data } = await supabase
      .from('invoices')
      .select('*')
      .or(`whatsapp_number.ilike.%${cleanQuery}%,invoice_number.ilike.%${cleanQuery}%`)
      .order('created_at', { ascending: false });

    if (data) setUserInvoices(data);
  }

  const handleCheckout = async () => {
    if (!robloxUsername.trim() || !robloxPassword.trim() || !whatsappNumber.trim()) {
      alert('Wajib mengisi Username Roblox, Password Roblox, dan Nomor WhatsApp aktif!');
      return;
    }

    const selectedPay = payments.find(p => p.id === selectedPaymentId);
    if (!selectedPay || selectedPay.is_archived) {
      alert('Metode pembayaran tidak valid!');
      return;
    }

    if (selectedPay.is_maintenance) {
      alert(`Metode pembayaran ${selectedPay.name} sedang maintenance. Pilih metode lain!`);
      return;
    }

    const generatedInvoiceNo = 'INV-' + Math.floor(10000 + Math.random() * 90000);

    const { error } = await supabase.from('invoices').insert([
      {
        invoice_number: generatedInvoiceNo,
        roblox_username: robloxUsername.trim(),
        roblox_password: robloxPassword.trim(),
        whatsapp_number: whatsappNumber.trim(),
        product_name: selectedItem.name,
        total_price: selectedItem.price,
        payment_method: selectedPay.name,
        status: 'PENDING'
      }
    ]);

    if (!error) {
      alert(`Pesanan Berhasil dibuat!\nNomor Invoice: ${generatedInvoiceNo}\nCek status pesanan via No. Invoice di menu Cek Pesanan.`);
      setSearchQuery(generatedInvoiceNo);
      handleSearchInvoices(generatedInvoiceNo);
      setSelectedItem(null);
      setRobloxUsername('');
      setRobloxPassword('');
      setIsCartOpen(true);
    } else {
      alert('Gagal checkout: ' + error.message);
    }
  };

  if (currentPath === '/admin') {
    return <AdminPanel onBack={() => { window.history.pushState({}, '', '/'); setCurrentPath('/'); }} />;
  }

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const visiblePayments = payments.filter(p => !p.is_archived);
  const selectedPaymentObj = visiblePayments.find(p => p.id === selectedPaymentId);

  return (
    <div className="pb-20 min-h-screen bg-[#08090d] text-slate-100 font-sans">
      <div className="animated-bg">
        <div className="orb orb-1 animate-float-1"></div>
        <div className="orb orb-2 animate-float-2"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 mewah-glass border-b border-white/10 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-200 via-slate-400 to-white text-slate-950 flex items-center justify-center font-onest font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              G
            </div>
            <div>
              <h1 className="font-onest font-bold text-lg text-white leading-none flex items-center gap-2">
               Limitz <span className="text-[10px] bg-gradient-to-r from-slate-700 to-slate-900 text-slate-200 border border-slate-600 px-2.5 py-0.5 rounded-full font-semibold uppercase">Summer 2026</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Marketplace Event Equipment Evade</p>
            </div>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-slate-100 to-white hover:brightness-110 rounded-xl shadow-md transition"
          >
            <ShoppingBag className="w-4 h-4 text-slate-900" />
            <span>Cek Pesanan / Invoice</span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
        <div className="relative rounded-3xl overflow-hidden mewah-glass p-6 md:p-10 border border-white/15 shadow-2xl">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-600/80 text-slate-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              EVADE SUMMER EVENT 2026 STORE
            </div>
            <h2 className="font-onest font-black text-3xl sm:text-5xl text-white leading-tight">
              Beli Item Event Evade Summer 2026 Murah!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Transaksi kilat via Direct Trade Server, 100% legal, aman anti-ban.
            </p>
          </div>
        </div>
      </section>

      {/* Katalog */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="font-onest font-black text-2xl text-white tracking-wide">
            Katalog Item Evade
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-xl text-xs font-bold ${selectedCategory === 'all' ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-300'}`}>Semua</button>
            <button onClick={() => setSelectedCategory('usable')} className={`px-4 py-2 rounded-xl text-xs font-bold ${selectedCategory === 'usable' ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-300'}`}>Usable</button>
            <button onClick={() => setSelectedCategory('utility')} className={`px-4 py-2 rounded-xl text-xs font-bold ${selectedCategory === 'utility' ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-300'}`}>Utility</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="mewah-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/10 text-white uppercase">{p.badge}</span>
                  <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded">🫧 {p.tokens} Tokens</span>
                </div>
                
                <div className="w-full aspect-square rounded-xl bg-black/50 overflow-hidden mb-4 border border-white/10 relative flex items-center justify-center">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105" 
                  />
                </div>

                <h3 className="font-onest font-bold text-white text-base">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] line-through text-slate-500 block">Rp{p.original_price?.toLocaleString('id-ID')}</span>
                  <span className="text-base font-black text-white">Rp{p.price?.toLocaleString('id-ID')}</span>
                </div>
                <button onClick={() => setSelectedItem(p)} className="px-3.5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center gap-1">
                  <span>Beli</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL CHECKOUT ORDER */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="mewah-glass w-full max-w-md rounded-3xl p-6 border border-white/20 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="font-onest font-bold text-white text-base">Detail Pesanan Topup</h3>
              <button onClick={() => setSelectedItem(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex gap-4 bg-black/40 p-3 rounded-2xl border border-white/10 items-center">
                <img src={selectedItem.image} onError={(e) => e.target.src='https://via.placeholder.com/100'} alt="" className="w-16 h-16 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedItem.name}</h4>
                  <span className="text-sm font-black text-emerald-400">Rp{selectedItem.price?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-amber-200 text-xs space-y-1 font-sans">
                <b className="font-bold text-amber-300 block flex items-center gap-1 text-[13px]">
                  <AlertCircle className="w-4 h-4 text-amber-400" /> 𝗖𝗮𝘁𝗮𝘁𝗮𝗻 𝗣𝗲𝗻𝘁𝗶𝗻𝗴:
                </b>
                <p className="text-[11px] text-amber-100/90 leading-relaxed">
                  Perlu diingat bahwa, Admin tidak pernah mengganti data akun semacam hb (hackback) saat setelah transaksi berhasil dan data akun ditransfer.
                </p>
                <span className="italic text-[11px] font-serif text-amber-300 block pt-1">
                  𝘩𝘢𝘱𝘱𝘺 𝘴𝘩𝘰𝘱𝘱𝘪𝘯𝘨..
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username Roblox</label>
                  <input type="text" value={robloxUsername} onChange={(e) => setRobloxUsername(e.target.value)} placeholder="Username Roblox..." className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-400" /> Password Roblox
                  </label>
                  <input type="password" value={robloxPassword} onChange={(e) => setRobloxPassword(e.target.value)} placeholder="Password Akun Roblox..." className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> No. WhatsApp Aktif (Untuk Cek Invoice)
                  </label>
                  <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="Contoh: 089527732022" className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  {visiblePayments.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPaymentId(p.id)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-bold flex flex-col justify-between transition ${
                        p.is_maintenance 
                          ? 'border-red-500/40 bg-red-950/20 text-red-300'
                          : selectedPaymentId === p.id 
                            ? 'border-white bg-white text-black' 
                            : 'border-white/10 bg-black/40 text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{p.name}</span>
                      {p.is_maintenance && <span className="text-[9px] text-red-400 font-normal">[Maintenance]</span>}
                    </button>
                  ))}
                </div>
              </div>

              {selectedPaymentObj && (
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 text-center space-y-2">
                  <span className="text-xs text-slate-400 font-mono">Petunjuk Bayar ({selectedPaymentObj.name}):</span>
                  {selectedPaymentObj.is_maintenance ? (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300">
                      Metode pembayaran ini sedang maintenance.
                    </div>
                  ) : selectedPaymentObj.qris_image ? (
                    <div className="bg-white p-2 rounded-xl inline-block mx-auto">
                      <img src={selectedPaymentObj.qris_image} alt="QRIS" className="w-44 h-44 object-contain mx-auto" />
                    </div>
                  ) : (
                    <div className="bg-black/50 p-3 rounded-xl border border-white/10">
                      <p className="text-xs text-slate-400">Nomor Rekening / E-Wallet:</p>
                      <p className="text-base font-mono font-bold text-emerald-400 select-all">{selectedPaymentObj.account_number}</p>
                      <p className="text-[11px] text-slate-300">A/N: {selectedPaymentObj.account_name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button onClick={handleCheckout} className="w-full py-3 bg-white text-slate-950 font-black text-xs rounded-xl shadow-lg">
              KONFIRMASI PESANAN
            </button>
          </div>
        </div>
      )}

      {/* MODAL CEK INVOICE PESANAN + BISA KLIK DETAIL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="mewah-glass w-full max-w-lg rounded-3xl p-6 border border-white/20 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="font-onest font-bold text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5" /> Pelacakan Invoice & Status
              </h3>
              <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="py-4 space-y-4 flex-1 overflow-y-auto">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Masukkan No. WhatsApp / No. Invoice..." 
                  className="flex-1 px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white" 
                />
                <button onClick={() => handleSearchInvoices(searchQuery)} className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" /> Cari
                </button>
              </div>

              {userInvoices.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-8">Ketik Nomor WhatsApp atau Nomor Invoice di atas untuk mengecek status pesanan.</p>
              ) : (
                userInvoices.map((inv) => (
                  <div 
                    key={inv.id} 
                    onClick={() => setSelectedInvoiceDetail(inv)}
                    className="p-4 bg-black/40 border border-white/10 hover:border-white/30 transition cursor-pointer rounded-2xl space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono text-emerald-400 font-bold block">{inv.invoice_number || 'INV-0000'}</span>
                        <span className="font-bold text-white text-sm">{inv.product_name}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                        inv.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        inv.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'
                      }`}>
                        {inv.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                        {inv.status === 'CANCELLED' && <XCircle className="w-3 h-3" />}
                        {inv.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {inv.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex justify-between items-center pt-1 border-t border-white/5">
                      <span>Total: <b className="text-white">Rp{inv.total_price?.toLocaleString('id-ID')}</b></span>
                      <span className="text-white font-bold text-[10px] flex items-center gap-0.5">
                        Lihat Detail Invoice <ChevronRight className="w-3 h-3 text-emerald-400" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* POPUP DETAIL LENGKAP INVOICE + NOTE ADMIN */}
      {selectedInvoiceDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4">
          <div className="mewah-glass w-full max-w-md rounded-3xl p-6 border border-white/20 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] text-slate-400 block">INVOICE OFFICIAL</span>
                <h3 className="font-mono font-black text-emerald-400 text-base">{selectedInvoiceDetail.invoice_number}</h3>
              </div>
              <button onClick={() => setSelectedInvoiceDetail(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="p-3 bg-black/50 rounded-xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Produk:</span>
                <b className="text-white">{selectedInvoiceDetail.product_name}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Harga:</span>
                <b className="text-emerald-400">Rp{selectedInvoiceDetail.total_price?.toLocaleString('id-ID')}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Metode Pembayaran:</span>
                <b className="text-white">{selectedInvoiceDetail.payment_method}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Transaksi:</span>
                <b className={`uppercase ${selectedInvoiceDetail.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedInvoiceDetail.status}
                </b>
              </div>
            </div>

            <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-amber-200 text-xs space-y-1">
              <b className="font-bold text-amber-300 block flex items-center gap-1 text-[12px]">
                <AlertCircle className="w-4 h-4 text-amber-400" /> 𝗖𝗮𝘁𝗮𝘁𝗮𝗻 𝗣𝗲𝗻𝘁𝗶𝗻𝗴:
              </b>
              <p className="text-[11px] text-amber-100/90 leading-relaxed">
                Perlu diingat bahwa, Admin tidak pernah mengganti data akun semacam hb (hackback) saat setelah transaksi berhasil dan data akun ditransfer.
              </p>
              <span className="italic text-[10px] font-serif text-amber-300 block pt-0.5">
                𝘩𝘢𝘱𝘱𝘺 𝘴𝘩𝘰𝘱𝘱𝘪𝘯𝘨..
              </span>
            </div>

            {selectedInvoiceDetail.admin_note ? (
              <div className="p-3 bg-blue-950/50 border border-blue-500/30 rounded-2xl text-xs space-y-1 text-blue-200">
                <b className="block text-blue-300 text-[11px] flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Pesan Khusus Dari Admin:
                </b>
                <p className="text-slate-200">{selectedInvoiceDetail.admin_note}</p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic text-center">Belum ada catatan khusus dari Admin.</p>
            )}

            <button onClick={() => setSelectedInvoiceDetail(null)} className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl">
              TUTUP DETAIL
            </button>
          </div>
        </div>
      )}
    </div>
  );
      }
