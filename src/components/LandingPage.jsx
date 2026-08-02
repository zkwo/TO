import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, Sparkles, ShieldCheck, Zap, RefreshCw, X, ArrowRight, Grid } from 'lucide-react';

export default function LandingPage({ onOpenAdmin }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [robloxUsername, setRobloxUsername] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').eq('is_archived', false).order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setProducts(data);
    } else {
      // Fallback Data bawaan jika Supabase masih kosong
      setProducts([
        { id: 'sum-01', name: 'Chilled Cola', base_type: 'Cola', category: 'usable', tokens: 30, price: 5000, original_price: 10000, description: 'Minuman cola dingin eksklusif Summer Event 2026.', image: 'https://static.wikia.nocookie.net/evade-nextbot/images/2/28/Chilled_Cola.jpeg/revision/latest?cb=20260718040441', badge: 'BESTSELLER' },
        { id: 'sum-02', name: 'Shark Teleporter', base_type: 'Teleporter', category: 'utility', tokens: 50, price: 15000, original_price: 22000, description: 'Teleporter bermotif mulut hiu pantai.', image: 'https://static.wikia.nocookie.net/evade-nextbot/images/2/28/Chilled_Cola.jpeg/revision/latest?cb=20260718040441', badge: 'HOT' },
        { id: 'sum-12', name: 'Baby Shark Flashlight', base_type: 'Flashlight', category: 'utility', tokens: 30, price: 2000, original_price: 5000, description: 'Senter berdesain anak hiu kecil.', image: 'https://static.wikia.nocookie.net/evade-roblox/images/d/d4/NeonLighter.png/revision/latest?cb=20230715000000', badge: 'BEST DEAL' }
      ]);
    }
  }

  const handleCheckout = async () => {
    if (!robloxUsername.trim()) {
      alert('Masukkan Username Roblox kamu terlebih dahulu!');
      return;
    }

    await supabase.from('invoices').insert([
      {
        roblox_username: robloxUsername,
        product_name: selectedItem.name,
        total_price: selectedItem.price,
        payment_method: paymentMethod,
        status: 'PENDING'
      }
    ]);

    setCartCount(cartCount + 1);
    setSelectedItem(null);
    setRobloxUsername('');
    alert(`Pesanan ${selectedItem.name} berhasil dibuat! Admin/Bot akan mengirimkan ke user ${robloxUsername}.`);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pb-20">
      {/* Dynamic Background Orbs */}
      <div className="animated-bg">
        <div className="orb orb-1 animate-float-1"></div>
        <div className="orb orb-2 animate-float-2"></div>
        <div className="orb orb-3 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 mewah-glass border-b border-white/10 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-200 via-slate-400 to-white text-slate-950 flex items-center justify-center font-onest font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              G
            </div>
            <div>
              <h1 className="font-onest font-bold text-lg text-white leading-none tracking-wide flex items-center gap-2">
                Golrox <span className="text-[10px] bg-gradient-to-r from-slate-700 to-slate-900 text-slate-200 border border-slate-600 px-2.5 py-0.5 rounded-full font-semibold uppercase">Summer 2026</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Official Evade Roblox Store</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onOpenAdmin} className="px-3 py-1.5 text-xs font-semibold bg-white/10 border border-white/10 rounded-xl hover:bg-white hover:text-black transition">
              Panel Admin
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-slate-100 to-white hover:brightness-110 rounded-xl shadow-md">
              <ShoppingBag className="w-4 h-4 text-slate-900" />
              <span className="bg-slate-950 text-white px-2 py-0.5 rounded-full text-[10px]">{cartCount}</span>
            </button>
          </div>
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
            <h2 className="font-onest font-black text-3xl sm:text-5xl text-white leading-tight silver-text-glow">
              Beli Item Event Evade Summer 2026 Murah!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Transaksi kilat via Direct Trade Server, 100% legal, aman anti-ban dengan harga mulai dari <span className="text-emerald-400 font-bold">Rp2.000 - Rp50.000</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="items" className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="font-onest font-black text-2xl text-white tracking-wide">
            Katalog Lengkap Evade Summer 2026
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-xl text-xs font-bold ${selectedCategory === 'all' ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-300'}`}>Semua Item</button>
            <button onClick={() => setSelectedCategory('usable')} className={`px-4 py-2 rounded-xl text-xs font-bold ${selectedCategory === 'usable' ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-300'}`}>Usables</button>
            <button onClick={() => setSelectedCategory('utility')} className={`px-4 py-2 rounded-xl text-xs font-bold ${selectedCategory === 'utility' ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-300'}`}>Utilities</button>
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
                <div className="w-full aspect-square rounded-xl bg-black/40 flex items-center justify-center p-3 mb-4">
                  <img src={p.image} alt={p.name} className="w-24 h-24 object-contain drop-shadow" />
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

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="mewah-glass w-full max-w-md rounded-3xl p-6 border border-white/20">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="font-onest font-bold text-white">Detail Pesanan Topup</h3>
              <button onClick={() => setSelectedItem(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex gap-4 bg-black/40 p-3 rounded-2xl border border-white/10">
                <img src={selectedItem.image} alt="" className="w-14 h-14 object-contain" />
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedItem.name}</h4>
                  <span className="text-sm font-black text-emerald-400">Rp{selectedItem.price?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Username Roblox</label>
                <input type="text" value={robloxUsername} onChange={(e) => setRobloxUsername(e.target.value)} placeholder="Username Roblox kamu..." className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white text-xs" />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Metode Pembayaran</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-slate-900 text-white text-xs">
                  <option value="qris">QRIS All Payment</option>
                  <option value="dana">DANA Instant</option>
                  <option value="gopay">GoPay</option>
                  <option value="bca">Transfer Bank BCA</option>
                </select>
              </div>
            </div>

            <button onClick={handleCheckout} className="w-full py-3 bg-white text-slate-950 font-black text-xs rounded-xl shadow-lg">
              BAYAR SEKARANG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
