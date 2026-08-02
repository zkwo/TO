import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import AdminPanel from './components/AdminPanel';
import { 
  ShoppingBag, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  X,
  CreditCard
} from 'lucide-react';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [robloxUsername, setRobloxUsername] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [cartCount, setCartCount] = useState(0);

  // Load produk dari Supabase saat aplikasi dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setProducts(data);
    } else {
      // Fallback Data Bawaan jika Supabase masih kosong / belum diisi
      setProducts([
        {
          id: 'sum-01',
          name: 'Chilled Cola',
          base_type: 'Cola',
          category: 'usable',
          tokens: 30,
          price: 5000,
          original_price: 10000,
          description: 'Minuman cola dingin eksklusif Summer Event 2026. Efek lari ekstra kencang.',
          image: 'https://static.wikia.nocookie.net/evade-nextbot/images/2/28/Chilled_Cola.jpeg/revision/latest?cb=20260718040441',
          badge: 'BESTSELLER'
        },
        {
          id: 'sum-02',
          name: 'Shark Teleporter',
          base_type: 'Teleporter',
          category: 'utility',
          tokens: 50,
          price: 15000,
          original_price: 22000,
          description: 'Teleporter bermotif mulut hiu pantai. Berpindah tempat instan.',
          image: 'https://static.wikia.nocookie.net/evade-nextbot/images/2/28/Chilled_Cola.jpeg/revision/latest?cb=20260718040441',
          badge: 'HOT'
        },
        {
          id: 'sum-12',
          name: 'Baby Shark Flashlight',
          base_type: 'Flashlight',
          category: 'utility',
          tokens: 30,
          price: 2000,
          original_price: 5000,
          description: 'Senter berdesain anak hiu kecil. Pencahayaan sangat terang.',
          image: 'https://static.wikia.nocookie.net/evade-roblox/images/d/d4/NeonLighter.png/revision/latest?cb=20230715000000',
          badge: 'BEST DEAL'
        }
      ]);
    }
  }

  // Fungsi checkout / simpan invoice ke Supabase
  const handleCheckout = async () => {
    if (!robloxUsername.trim()) {
      alert('Masukkan Username Roblox kamu terlebih dahulu!');
      return;
    }

    const { error } = await supabase.from('invoices').insert([
      {
        roblox_username: robloxUsername,
        product_name: selectedItem.name,
        total_price: selectedItem.price,
        payment_method: paymentMethod,
        status: 'PENDING'
      }
    ]);

    if (!error) {
      setCartCount(cartCount + 1);
      alert(`Pesanan ${selectedItem.name} berhasil dibuat! Admin/Bot akan segera memproses ke akun Roblox: ${robloxUsername}.`);
      setSelectedItem(null);
      setRobloxUsername('');
    } else {
      alert('Gagal membuat pesanan: ' + error.message);
    }
  };

  // Render Panel Admin jika tombol dipencet
  if (isAdminView) {
    return <AdminPanel onBack={() => setIsAdminView(false)} />;
  }

  // Filter kategori produk (All / Usable / Utility)
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pb-20">
      {/* Dynamic Animated Glowing Background */}
      <div className="animated-bg">
        <div className="orb orb-1 animate-float-1"></div>
        <div className="orb orb-2 animate-float-2"></div>
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 mewah-glass border-b border-white/10 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-200 via-slate-400 to-white text-slate-950 flex items-center justify-center font-onest font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              G
            </div>
            <div>
              <h1 className="font-onest font-bold text-lg text-white leading-none flex items-center gap-2">
                Golrox <span className="text-[10px] bg-gradient-to-r from-slate-700 to-slate-900 text-slate-200 border border-slate-600 px-2.5 py-0.5 rounded-full font-semibold uppercase">Summer 2026</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Official Evade Roblox Store</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAdminView(true)} 
              className="px-3 py-1.5 text-xs bg-white/10 border border-white/10 rounded-xl hover:bg-white hover:text-black transition"
            >
              Panel Admin
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-slate-100 to-white rounded-xl shadow-md">
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
            <h2 className="font-onest font-black text-3xl sm:text-5xl text-white leading-tight">
              Beli Item Event Evade Summer 2026 Murah!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Transaksi kilat via Direct Trade Server, 100% legal, aman anti-ban dengan harga mulai dari <span className="text-emerald-400 font-bold">Rp2.000 - Rp50.000</span>.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Proses 1-3 Menit
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garansi Item Masuk
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Auto Sync Supabase
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="font-onest font-black text-2xl text-white tracking-wide">
            Katalog Item Evade Summer 2026
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setSelectedCategory('all')} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedCategory === 'all' ? 'bg-white text-slate-950 shadow-lg' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              Semua Item
            </button>
            <button 
              onClick={() => setSelectedCategory('usable')} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedCategory === 'usable' ? 'bg-white text-slate-950 shadow-lg' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              Usables / Consumables
            </button>
            <button 
              onClick={() => setSelectedCategory('utility')} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedCategory === 'utility' ? 'bg-white text-slate-950 shadow-lg' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              Utilities & Sensors
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="mewah-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/10 text-white uppercase tracking-wider">{p.badge}</span>
                  <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">🫧 {p.tokens} Tokens</span>
                </div>
                <div className="w-full aspect-square rounded-xl bg-black/40 flex items-center justify-center p-3 mb-4 border border-white/5">
                  <img src={p.image} alt={p.name} className="w-24 h-24 object-contain drop-shadow" />
                </div>
                <h3 className="font-onest font-bold text-white text-base">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] line-through text-slate-500 block">Rp{p.original_price?.toLocaleString('id-ID')}</span>
                  <span className="text-base font-black text-white">Rp{p.price?.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={() => setSelectedItem(p)} 
                  className="px-3.5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition flex items-center gap-1 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                >
                  <span>Beli</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Checkout Payment Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="mewah-glass w-full max-w-md rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-white" />
                <h3 className="font-onest font-bold text-white text-base">Detail Pesanan Topup</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Item Card Ringkas */}
              <div className="flex gap-4 bg-black/40 p-3 rounded-2xl border border-white/10 items-center">
                <div className="w-14 h-14 rounded-xl bg-black/60 p-2 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <img src={selectedItem.image} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{selectedItem.name}</h4>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-bold">{selectedItem.tokens} Tokens</span>
                  </div>
                  <span className="text-sm font-black text-emerald-400 block mt-0.5">Rp{selectedItem.price?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Input Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username Roblox (Harus Akurat)</label>
                <input 
                  type="text" 
                  value={robloxUsername} 
                  onChange={(e) => setRobloxUsername(e.target.value)} 
                  placeholder="Masukkan Username Roblox kamu..." 
                  className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/50 text-white placeholder:text-slate-600 text-xs font-medium focus:outline-none focus:border-white transition" 
                />
              </div>

              {/* Select Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Metode Pembayaran</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-white/15 bg-slate-900 text-white text-xs font-medium focus:outline-none focus:border-white transition"
                >
                  <option value="qris">QRIS All Payment (Bebas Admin)</option>
                  <option value="dana">DANA Instant</option>
                  <option value="gopay">GoPay</option>
                  <option value="shopeepay">ShopeePay</option>
                  <option value="bca">Transfer Bank BCA</option>
                </select>
              </div>

              {/* Detail Rincian Biaya */}
              <div className="border-t border-white/10 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Harga Item</span>
                  <span>Rp{selectedItem.price?.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Biaya Layanan/Admin</span>
                  <span className="text-emerald-400 font-semibold">GRATIS</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-white pt-2 border-t border-dashed border-white/10">
                  <span>Total Pembayaran</span>
                  <span className="text-emerald-400">Rp{selectedItem.price?.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleCheckout} 
              className="w-full py-3.5 bg-gradient-to-r from-slate-100 via-slate-200 to-white hover:brightness-110 text-slate-950 font-onest font-black text-xs rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-900" />
              <span>BAYAR SEKARANG (PROSES OTOMATIS)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
