import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, Receipt, LogOut, CreditCard, Upload, Check, X, RefreshCw } from 'lucide-react';

const DEFAULT_PAYMENTS = [
  { id: 'qris', name: 'QRIS All Payment', account_number: '-', account_name: 'Golrox Store', qris_image: 'https://via.placeholder.com/300?text=QRIS+CODE', is_maintenance: false },
  { id: 'dana', name: 'DANA Instant', account_number: '089527732022', account_name: 'Golrox Store', qris_image: '', is_maintenance: false },
  { id: 'gopay', name: 'GoPay', account_number: '089527732022', account_name: 'Golrox Store', qris_image: '', is_maintenance: false },
  { id: 'bca', name: 'Transfer Bank BCA', account_number: '1234567890', account_name: 'Golrox Store', qris_image: '', is_maintenance: false }
];

export default function AdminPanel({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);

  // Form Product State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [baseType, setBaseType] = useState('Cola');
  const [category, setCategory] = useState('usable');
  const [tokens, setTokens] = useState(30);
  const [price, setPrice] = useState(5000);
  const [originalPrice, setOriginalPrice] = useState(10000);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [notes, setNotes] = useState({});
  const ADMIN_PASS = '089527732022';

  useEffect(() => {
    if (isAuthenticated) loadAdminData();
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASS) setIsAuthenticated(true);
    else alert('Password Admin Salah!');
  };

  async function loadAdminData() {
    const { data: prod } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (prod) setProducts(prod);

    const { data: inv } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (inv) {
      setInvoices(inv);
      const initialNotes = {};
      inv.forEach(i => initialNotes[i.id] = i.admin_note || '');
      setNotes(initialNotes);
    }

    const { data: pay } = await supabase.from('payment_settings').select('*');
    if (pay && pay.length > 0) {
      setPayments(pay);
    } else {
      setPayments(DEFAULT_PAYMENTS);
    }
  }

  // Safe File Upload (Base64)
  const handleSafeFileUpload = (e, setTargetUrl) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setTargetUrl(reader.result);
      alert('Gambar berhasil dipasang!');
    };
    reader.readAsDataURL(file);
  };

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
      image: imageUrl,
      badge: 'LIMITED'
    };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
    } else {
      await supabase.from('products').insert([payload]);
    }

    resetProductForm();
    loadAdminData();
  };

  const handleUpdateInvoice = async (id, status) => {
    const noteText = notes[id] || '';
    const { error } = await supabase
      .from('invoices')
      .update({ status, admin_note: noteText })
      .eq('id', id);

    if (!error) {
      alert(`Status pesanan berhasil diubah ke ${status}!`);
      loadAdminData();
    } else {
      alert('Gagal update invoice: ' + error.message);
    }
  };

  const handleSavePayment = async (payObj) => {
    const { error } = await supabase
      .from('payment_settings')
      .upsert({
        id: payObj.id,
        name: payObj.name,
        account_number: payObj.account_number,
        account_name: payObj.account_name,
        qris_image: payObj.qris_image,
        is_maintenance: payObj.is_maintenance,
        updated_at: new Date().toISOString()
      });

    if (!error) {
      alert(`Metode Pembayaran ${payObj.name} berhasil disimpan!`);
      loadAdminData();
    } else {
      alert('Gagal menyimpan: ' + error.message);
    }
  };

  const resetProductForm = () => {
    setEditingId(null);
    setName('');
    setImageUrl('');
    setDescription('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090d] flex items-center justify-center p-4">
        <div className="w-full max-w-md mewah-glass border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="font-onest text-xl font-bold text-white mb-6">ADMIN PANEL LOGIN</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan Password Admin"
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white mb-4 focus:outline-none"
          />
          <button onClick={handleLogin} className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl">MASUK PANEL</button>
          <button onClick={onBack} className="mt-4 text-xs text-slate-400 block mx-auto hover:underline">← Kembali ke Website</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#08090d] text-slate-100 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <div>
            <h1 className="font-onest font-bold text-xl text-white">ADMIN PANEL — ZHENS STORE</h1>
            <p className="text-xs text-slate-400">URL Akses: /admin</p>
          </div>
          <button onClick={onBack} className="px-5 py-2 rounded-full border border-white/20 text-xs text-slate-300 hover:bg-white hover:text-black transition flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" /> KELUAR
          </button>
        </div>

        {/* Tab Menu */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          <button onClick={() => setActiveTab('products')} className={`px-5 py-2.5 rounded-full text-xs font-bold ${activeTab === 'products' ? 'bg-white text-black' : 'bg-white/5 text-slate-400'}`}>
            <ShoppingBag className="w-4 h-4 inline mr-1" /> Kelola Produk
          </button>
          <button onClick={() => setActiveTab('invoices')} className={`px-5 py-2.5 rounded-full text-xs font-bold ${activeTab === 'invoices' ? 'bg-white text-black' : 'bg-white/5 text-slate-400'}`}>
            <Receipt className="w-4 h-4 inline mr-1" /> Invoice & Data User
          </button>
          <button onClick={() => setActiveTab('payments')} className={`px-5 py-2.5 rounded-full text-xs font-bold ${activeTab === 'payments' ? 'bg-white text-black' : 'bg-white/5 text-slate-400'}`}>
            <CreditCard className="w-4 h-4 inline mr-1" /> Pengaturan Pembayaran
          </button>
        </div>

        {/* TAB 1: KELOLA PRODUK */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="mewah-glass rounded-2xl p-6 border border-white/10">
              <h2 className="font-bold text-sm text-white mb-4">{editingId ? 'EDIT PRODUK' : 'TAMBAH PRODUK BARU'}</h2>
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} required className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <input type="text" placeholder="Base Type" value={baseType} onChange={(e) => setBaseType(e.target.value)} required className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white">
                    <option value="usable">Usable</option>
                    <option value="utility">Utility</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="number" placeholder="Tokens" value={tokens} onChange={(e) => setTokens(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <input type="number" placeholder="Harga Topup (Rp)" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <input type="number" placeholder="Harga Coret (Rp)" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-slate-300">Gambar Produk (Upload File / Paste Link URL)</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="URL Gambar..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white" />
                    <label className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1">
                      <Upload className="w-4 h-4" /> Upload
                      <input type="file" accept="image/*" onChange={(e) => handleSafeFileUpload(e, setImageUrl)} className="hidden" />
                    </label>
                  </div>
                </div>

                <textarea placeholder="Deskripsi Ringkas" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white h-20" />

                <button type="submit" className="px-6 py-3 bg-emerald-500 text-black font-bold text-xs rounded-xl">SIMPAN PRODUK</button>
              </form>
            </div>

            <div className="mewah-glass rounded-2xl p-6 overflow-x-auto border border-white/10">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2">Produk</th>
                    <th className="py-2">Harga</th>
                    <th className="py-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-white/5">
                      <td className="py-3 font-bold flex items-center gap-2">
                        <img src={p.image} onError={(e) => e.target.src='https://via.placeholder.com/50'} className="w-8 h-8 object-contain rounded bg-black" />
                        {p.name}
                      </td>
                      <td className="py-3">Rp{p.price?.toLocaleString('id-ID')}</td>
                      <td className="py-3 text-right space-x-2">
                        <button onClick={() => { setEditingId(p.id); setName(p.name); setImageUrl(p.image); setPrice(p.price); setDescription(p.description); }} className="px-3 py-1 bg-amber-500 text-black font-bold rounded">Edit</button>
                        <button onClick={async () => { if(confirm('Hapus?')) { await supabase.from('products').delete().eq('id', p.id); loadAdminData(); }}} className="px-3 py-1 bg-red-500 text-white font-bold rounded">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INVOICE & DATA LOGIN PEMBELI */}
        {activeTab === 'invoices' && (
          <div className="mewah-glass rounded-2xl p-6 border border-white/10 overflow-x-auto space-y-4">
            <h2 className="font-bold text-sm text-white">DAFTAR INVOICE & AKUN PEMBELI</h2>
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Belum ada pesanan masuk.</p>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start text-xs border-b border-white/5 pb-3">
                      <div>
                        <span className="font-mono text-emerald-400 font-bold block">{inv.invoice_number || 'INV-0000'}</span>
                        <b className="text-white text-sm block mt-1">Item: {inv.product_name} (Rp{inv.total_price?.toLocaleString('id-ID')})</b>
                        <span className="text-slate-400">Metode Bayar: {inv.payment_method}</span>
                      </div>
                      <span className="font-bold uppercase text-amber-400 bg-amber-950/40 border border-amber-800 px-3 py-1 rounded-full">{inv.status}</span>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Username Roblox:</span>
                        <b className="text-white font-mono">{inv.roblox_username}</b>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Password Roblox:</span>
                        <b className="text-amber-400 font-mono select-all">{inv.roblox_password || '-'}</b>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">No. WhatsApp:</span>
                        <b className="text-emerald-400 font-mono select-all">{inv.whatsapp_number || '-'}</b>
                      </div>
                    </div>

                    <input 
                      type="text" 
                      placeholder="Tulis note khusus untuk pembeli..." 
                      value={notes[inv.id] || ''} 
                      onChange={(e) => setNotes({ ...notes, [inv.id]: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white" 
                    />

                    <div className="flex justify-end gap-2 pt-2">
                      <button onClick={() => handleUpdateInvoice(inv.id, 'COMPLETED')} className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl flex items-center gap-1">
                        <Check className="w-4 h-4" /> Tandai Selesai
                      </button>
                      <button onClick={() => handleUpdateInvoice(inv.id, 'CANCELLED')} className="px-4 py-2 bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-1">
                        <X className="w-4 h-4" /> Batalkan
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PEMBAYARAN */}
        {activeTab === 'payments' && (
          <div className="mewah-glass rounded-2xl p-6 border border-white/10 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-sm text-white">PENGATURAN METODE PEMBAYARAN</h2>
              <button 
                onClick={() => {
                  payments.forEach(p => handleSavePayment(p));
                  alert('Semua metode pembayaran di-sync ke Supabase!');
                }}
                className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sync ke Supabase
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {payments.map((p, idx) => (
                <div key={p.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <b className="text-white text-xs uppercase">{p.name}</b>
                    <label className="flex items-center gap-2 text-xs text-red-400 font-bold cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={p.is_maintenance} 
                        onChange={(e) => {
                          const updated = [...payments];
                          updated[idx].is_maintenance = e.target.checked;
                          setPayments(updated);
                        }} 
                        className="w-4 h-4 accent-red-500" 
                      />
                      Maintenance
                    </label>
                  </div>

                  <input 
                    type="text" 
                    placeholder="No. Rekening / E-Wallet..."
                    value={p.account_number || ''} 
                    onChange={(e) => {
                      const updated = [...payments];
                      updated[idx].account_number = e.target.value;
                      setPayments(updated);
                    }} 
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white" 
                  />

                  <input 
                    type="text" 
                    placeholder="A/N Pemilik Rekening..."
                    value={p.account_name || ''} 
                    onChange={(e) => {
                      const updated = [...payments];
                      updated[idx].account_name = e.target.value;
                      setPayments(updated);
                    }} 
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white" 
                  />

                  {p.id === 'qris' && (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="URL Gambar QRIS..."
                        value={p.qris_image || ''} 
                        onChange={(e) => {
                          const updated = [...payments];
                          updated[idx].qris_image = e.target.value;
                          setPayments(updated);
                        }} 
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl p-2 text-xs text-white" 
                      />
                      <label className="px-3 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> File
                        <input type="file" accept="image/*" onChange={(e) => handleSafeFileUpload(e, (url) => {
                          const updated = [...payments];
                          updated[idx].qris_image = url;
                          setPayments(updated);
                        })} className="hidden" />
                      </label>
                    </div>
                  )}

                  <button onClick={() => handleSavePayment(p)} className="w-full py-2.5 bg-emerald-500 text-black font-bold text-xs rounded-xl">
                    SIMPAN PENGATURAN {p.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
    }
