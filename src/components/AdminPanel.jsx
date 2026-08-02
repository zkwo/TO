import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LayoutDashboard, ShoppingBag, Receipt, LogOut, ChevronDown, Plus, Trash2, Edit3, Archive } from 'lucide-react';

export default function AdminPanel({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'invoices'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [baseType, setBaseType] = useState('Cola');
  const [category, setCategory] = useState('usable');
  const [tokens, setTokens] = useState(30);
  const [price, setPrice] = useState(5000);
  const [originalPrice, setOriginalPrice] = useState(10000);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('NEW');

  const ADMIN_PASS = '089527732022';

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASS) {
      setIsAuthenticated(true);
    } else {
      alert('Password salah!');
    }
  };

  async function loadAdminData() {
    const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (prodData) setProducts(prodData);

    const { data: invData } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (invData) setInvoices(invData);
  }

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      base_type: baseType,
      category,
      tokens: parseInt(tokens),
      price: parseInt(price),
      original_price: parseInt(originalPrice),
      description,
      image,
      badge
    };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
    } else {
      await supabase.from('products').insert([payload]);
    }

    resetForm();
    loadAdminData();
  };

  const handleEditProduct = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setBaseType(p.base_type);
    setCategory(p.category);
    setTokens(p.tokens);
    setPrice(p.price);
    setOriginalPrice(p.original_price);
    setDescription(p.description);
    setImage(p.image);
    setBadge(p.badge);
  };

  const toggleArchive = async (p) => {
    await supabase.from('products').update({ is_archived: !p.is_archived }).eq('id', p.id);
    loadAdminData();
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Hapus produk ini secara permanen?')) {
      await supabase.from('products').delete().eq('id', id);
      loadAdminData();
    }
  };

  const updateInvoiceStatus = async (id, status) => {
    await supabase.from('invoices').update({ status }).eq('id', id);
    loadAdminData();
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setBaseType('Cola');
    setCategory('usable');
    setTokens(30);
    setPrice(5000);
    setOriginalPrice(10000);
    setDescription('');
    setImage('');
    setBadge('NEW');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090d] flex items-center justify-center p-4">
        <div className="w-full max-w-md mewah-glass border border-white/10 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl">
          <h2 className="font-onest text-xl font-bold tracking-widest text-white mb-6">ADMIN PANEL LOGIN</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan Password Admin"
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white mb-4 focus:outline-none"
          />
          <button onClick={handleLogin} className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-slate-200 transition">
            MASUK PANEL
          </button>
          <button onClick={onBack} className="mt-4 text-xs text-slate-400 hover:underline block mx-auto">
            ← Kembali ke Website Store
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'products', label: 'Kelola Produk & Harga', icon: ShoppingBag },
    { id: 'invoices', label: 'Invoice Pesanan Masuk', icon: Receipt },
  ];

  return (
    <div className="bg-[#08090d] text-slate-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Admin */}
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <div>
            <h1 className="font-onest font-bold text-xl text-white tracking-wider">ZHENS STORE — ADMIN PANEL</h1>
            <p className="text-xs text-slate-400">Pengaturan Realtime Database Cloud</p>
          </div>
          <button onClick={onBack} className="px-5 py-2 rounded-full border border-white/20 text-xs text-slate-300 hover:bg-white hover:text-black transition flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" /> KELUAR
          </button>
        </div>

        {/* Tab Nav Menu (Desktop) */}
        <div className="hidden md:flex gap-2 border-b border-white/10 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === item.id 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Dropdown Navigation Menu (Mobile) */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl p-3 flex justify-between items-center text-xs font-mono text-white"
          >
            <span>{navItems.find(i => i.id === activeTab)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/15 rounded-xl overflow-hidden z-30 shadow-2xl p-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                      activeTab === item.id ? 'bg-white text-black font-bold' : 'text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* TAB PRODUK */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="mewah-glass rounded-2xl p-6 border border-white/10">
              <h2 className="font-onest font-bold text-sm text-white mb-4 border-b border-white/5 pb-2">
                {editingId ? 'EDIT PRODUK' : 'TAMBAH PRODUK BARU'}
              </h2>
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} required className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <input type="text" placeholder="Base Type (misal: Cola)" value={baseType} onChange={(e) => setBaseType(e.target.value)} required className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white">
                    <option value="usable">Usable / Consumable</option>
                    <option value="utility">Utility / Sensor</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="number" placeholder="Jumlah Tokens (30)" value={tokens} onChange={(e) => setTokens(e.target.value)} required className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <input type="number" placeholder="Harga Topup (Rp)" value={price} onChange={(e) => setPrice(e.target.value)} required className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <input type="number" placeholder="Harga Coret (Rp)" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} required className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="URL Gambar Produk" value={image} onChange={(e) => setImage(e.target.value)} required className="sm:col-span-2 bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <input type="text" placeholder="Badge (BESTSELLER)" value={badge} onChange={(e) => setBadge(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                </div>

                <textarea placeholder="Deskripsi Produk" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white h-20" />

                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2.5 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400">
                    SIMPAN PRODUK
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl">BATAL</button>
                  )}
                </div>
              </form>
            </div>

            <div className="mewah-glass rounded-2xl p-6 overflow-x-auto border border-white/10">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2">Produk</th>
                    <th className="py-2">Harga</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-white/5">
                      <td className="py-3 font-bold flex items-center gap-2">
                        <img src={p.image} alt="" className="w-8 h-8 object-contain rounded bg-black/40" />
                        {p.name}
                      </td>
                      <td className="py-3">Rp{p.price?.toLocaleString('id-ID')}</td>
                      <td className="py-3">
                        {p.is_archived ? <span className="text-amber-400">[Archived]</span> : <span className="text-emerald-400">[Active]</span>}
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button onClick={() => toggleArchive(p)} className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded">
                          {p.is_archived ? 'Unarchive' : 'Archive'}
                        </button>
                        <button onClick={() => handleEditProduct(p)} className="px-2.5 py-1 bg-amber-500 text-black font-bold rounded">Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="px-2.5 py-1 bg-red-500 text-white font-bold rounded">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB INVOICE */}
        {activeTab === 'invoices' && (
          <div className="mewah-glass rounded-2xl p-6 border border-white/10 overflow-x-auto">
            <h2 className="font-onest font-bold text-sm text-white mb-4">DAFTAR INVOICE PESANAN MASUK</h2>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2">User Roblox</th>
                  <th className="py-2">Item</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Metode</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-white/5">
                    <td className="py-3 font-bold text-white">{inv.roblox_username}</td>
                    <td className="py-3">{inv.product_name}</td>
                    <td className="py-3 text-emerald-400 font-bold">Rp{inv.total_price?.toLocaleString('id-ID')}</td>
                    <td className="py-3 uppercase">{inv.payment_method}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${inv.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-1">
                      <button onClick={() => updateInvoiceStatus(inv.id, 'COMPLETED')} className="px-2 py-1 bg-emerald-500 text-black font-bold rounded">Selesai</button>
                      <button onClick={() => updateInvoiceStatus(inv.id, 'CANCELLED')} className="px-2 py-1 bg-red-500 text-white font-bold rounded">Batal</button>
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
