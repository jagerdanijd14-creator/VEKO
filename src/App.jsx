import React, { useState, useEffect, useRef } from 'react';

// Firebase importálása hivatalos Google CDN-ről
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Google Generative AI SDK importálása a képfeldolgozáshoz
import { GoogleGenerativeAI } from "https://esm.run/@google/genai";

const firebaseConfig = {
  apiKey: "AIzaSyB23-KbyZjY5LhNziuLhK_0x1YbXCryFRo",
  authDomain: "veko-b98e7.firebaseapp.com",
  projectId: "veko-b98e7",
  storageBucket: "veko-b98e7.firebasestorage.app",
  messagingSenderId: "179903827345",
  appId: "1:179903827345:web:d3ee0d1fd7f06315e5de30",
  measurementId: "G-3Y4D277585"
};

// Firebase inicializálás
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [activeTab, setActiveTab] = useState('products');
  const codeInputRef = useRef(null);

  const [categories, setCategories] = useState(['VEKO', 'Mosószer', 'Öblítő', 'Tisztítószer', 'Papíráru', 'Testápolás']);
  const [shelves, setShelves] = useState([
    { id: 1, name: 'A001', category: 'Öblítő' },
    { id: 2, name: 'A002', category: 'Tisztítószer' },
  ]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingImage, setProcessingImage] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('veko_gemini_key') || '');

  const [editingId, setEditingId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newShelfName, setNewShelfName] = useState('');
  const [newShelfCategory, setNewShelfCategory] = useState('VEKO');

  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    category: 'VEKO',
    quantity: '',
    startDate: '',
    endDate: '',
    status: 'Tükrözendő',
  });

  // Szűrési és rendezési állapotok
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterQuantity, setFilterQuantity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Adatok betöltése a Firestore-ból induláskor
  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const loadedProducts = [];
        querySnapshot.forEach((docSnap) => {
          loadedProducts.push({ id: docSnap.id, ...docSnap.data() });
        });
        setProducts(loadedProducts);
      } catch (error) {
        console.error("Hiba az adatok betöltésekor:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSaveApiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('veko_gemini_key', key);
  };

  // Kép konvertálása Base64 formátumba a Gemini számára
  const fileToGenerativePart = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // PDT Lista Kép Feldolgozása a Gemini AI-vel
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!geminiApiKey.trim()) {
      const key = prompt("Kérlek, add meg a Gemini API kulcsodat a képfeldolgozáshoz:");
      if (!key) return;
      handleSaveApiKey(key);
    }

    setProcessingImage(true);
    try {
      const ai = new GoogleGenerativeAI({ apiKey: geminiApiKey });
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

      let allExtractedItems = [];

      for (let i = 0; i < files.length; i++) {
        const imagePart = await fileToGenerativePart(files[i]);
        
        const prompt = `Elemezd ezt a Penny VEKO PDT listát vagy raktárkészlet képet! Olvasd ki a tételsorokat, és add vissza kizárólag egy tiszta JSON tömb formájában (semmilyen más szöveget ne írj köré, csak a JSON-t). 
        Minden elem objektum legyen a következő kulcsokkal:
        - "code": cikkszám (string)
        - "name": termék teljes neve (string)
        - "quantity": raktár mennyiség (szám)
        Ha egy mező nem olvasható, adj meg alapértelmezett értéket.`;

        const response = await model.generateContent([prompt, imagePart]);
        const textResponse = response.response.text();
        
        // JSON tisztítása és feldolgozása
        const cleanedJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedItems = JSON.parse(cleanedJson);
        allExtractedItems = [...allExtractedItems, ...parsedItems];
      }

      // Adatok szinkronizálása a Firestore adatbázissal
      const updatedProducts = [...products];

      for (const item of allExtractedItems) {
        const existingIndex = updatedProducts.findIndex(p => p.code === String(item.code));
        const qty = Number(item.quantity) || 0;
        const status = qty <= 0 ? 'Elfogyott' : 'Tükrözendő';

        if (existingIndex >= 0) {
          // Meglévő termék frissítése
          const target = updatedProducts[existingIndex];
          target.quantity = qty;
          target.status = status;
          await setDoc(doc(db, "products", String(target.id)), target);
        } else {
          // Új termék létrehozása
          const newId = String(Date.now() + Math.random());
          const newItem = {
            id: newId,
            code: String(item.code || ''),
            name: String(item.name || 'Ismeretlen termék'),
            category: 'VEKO',
            locationFormat: 'VEKO/0/000',
            quantity: qty,
            startDate: '',
            endDate: '',
            status: status
          };
          await setDoc(doc(db, "products", newId), newItem);
          updatedProducts.unshift(newItem);
        }
      }

      setProducts(updatedProducts);
      alert(`Sikeres feldolgozás! ${allExtractedItems.length} tétel feldolgozva és szinkronizálva a Firestore-ral.`);
    } catch (error) {
      console.error("Hiba a képfeldolgozás során:", error);
      alert("Hiba történt a kép elemzésekor. Kérlek ellenőrizd az API kulcsot vagy a kép minőségét.");
    } finally {
      setProcessingImage(false);
      e.target.value = null;
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const formattedCat = newCategoryName.trim();
    if (categories.includes(formattedCat)) return;
    setCategories([...categories, formattedCat].sort((a, b) => a.localeCompare(b, 'hu')));
    setNewCategoryName('');
  };

  const handleAddShelf = (e) => {
    e.preventDefault();
    if (!newShelfName.trim()) return;
    const item = { id: Date.now(), name: newShelfName.trim(), category: newShelfCategory };
    setShelves([...shelves, item]);
    setNewShelfName('');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name) return;
    const qty = Number(newProduct.quantity) || 0;
    const calculatedStatus = qty <= 0 ? 'Elfogyott' : newProduct.status;

    const targetId = editingId ? String(editingId) : String(Date.now());
    const itemData = {
      id: targetId,
      ...newProduct,
      quantity: qty,
      status: calculatedStatus,
      locationFormat: newProduct.locationFormat || 'VEKO/0/000'
    };

    try {
      await setDoc(doc(db, "products", targetId), itemData);
      if (editingId) {
        setProducts(products.map((p) => (p.id === editingId ? itemData : p)));
        setEditingId(null);
      } else {
        setProducts([itemData, ...products]);
      }
      setNewProduct({ code: '', name: '', category: 'VEKO', quantity: '', startDate: '', endDate: '', status: 'Tükrözendő' });
    } catch (error) {
      console.error("Hiba a mentés során:", error);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({ ...product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", String(id)));
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Hiba a törlés során:", error);
    }
  };

  const toggleStatus = async (id) => {
    const updated = products.map((p) => {
      if (p.id === id && Number(p.quantity) > 0) {
        const nextStatus = p.status === 'Kihelyezve' ? 'Tükrözendő' : 'Kihelyezve';
        return { ...p, status: nextStatus };
      }
      return p;
    });
    const target = updated.find(p => p.id === id);
    if (target) {
      await setDoc(doc(db, "products", String(id)), target);
      setProducts(updated);
    }
  };

  const handleAssignLocation = async (productId, newLocation) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, locationFormat: newLocation, status: newLocation !== 'VEKO/0/000' ? 'Kihelyezve' : 'Tükrözendő' };
      }
      return p;
    });
    const target = updated.find(p => p.id === productId);
    if (target) {
      await setDoc(doc(db, "products", String(productId)), target);
      setProducts(updated);
    }
  };

  const filteredAndSortedProducts = products.filter((p) => {
    return (
      (p.code || '').toLowerCase().includes(filterCode.toLowerCase()) &&
      (p.name || '').toLowerCase().includes(filterName.toLowerCase()) &&
      (filterCategory === '' || p.category === filterCategory) &&
      (p.locationFormat || '').toLowerCase().includes(filterLocation.toLowerCase()) &&
      (filterQuantity === '' || String(p.quantity).includes(filterQuantity)) &&
      (filterStatus === '' || p.status === filterStatus)
    );
  }).sort((a, b) => {
    let valA = a[sortBy] || '';
    let valB = b[sortBy] || '';
    if (sortBy === 'quantity') {
      return sortOrder === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    }
    const comp = String(valA).localeCompare(String(valB), 'hu', { numeric: true });
    return sortOrder === 'asc' ? comp : -comp;
  });

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>Kapcsolódás a Firebase Firestore adatbázishoz...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <h1 style={styles.title}>PENNY - VEKO Asszisztens</h1>
          <span style={styles.subtitle}>Gemini AI + Firestore | Termékek: {products.length} db</span>
        </div>
        <nav style={styles.nav}>
          <button style={activeTab === 'products' ? { ...styles.navBtn, ...styles.activeNavBtn } : styles.navBtn} onClick={() => setActiveTab('products')}>📦 Termékek</button>
          <button style={activeTab === 'shelves' ? { ...styles.navBtn, ...styles.activeNavBtn } : styles.navBtn} onClick={() => setActiveTab('shelves')}>📍 Polcok</button>
          <button style={activeTab === 'categories' ? { ...styles.navBtn, ...styles.activeNavBtn } : styles.navBtn} onClick={() => setActiveTab('categories')}>🏷️ Kategóriák</button>
          <button style={activeTab === 'veko' ? { ...styles.navBtn, ...styles.activeNavBtn } : styles.navBtn} onClick={() => setActiveTab('veko')}>🔄 Tükrözés</button>
        </nav>
      </header>

      <main style={styles.main}>
        {activeTab === 'products' && (
          <div>
            {/* Képfeltöltő sáv a Gemini AI-hez */}
            <div style={{ ...styles.card, background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', color: '#fff' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>📸 PDT Lista Fotózás & Gemini AI Feldolgozás</h3>
              <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '15px' }}>
                Tölts fel akár több oldalas PDT listafotót is. A Gemini AI automatikusan felismeri a termékeket, frissíti a meglévők raktárkészletét, vagy létrehozza az újakat a Firestore adatbázisban[span_1](start_span)[span_1](end_span)!
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={styles.uploadBtn}>
                  {processingImage ? 'Feldolgozás alatt...' : '📁 PDT Képek Kiválasztása / Fotózása'}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} disabled={processingImage} />
                </label>
                {processingImage && <span style={{ fontSize: '13px', fontStyle: 'italic' }}>Kérlek várj, a Gemini elemzi a képet...</span>}
              </div>
            </div>

            <h2>Vegyi Inout Termékek</h2>
            <div style={styles.card}>
              <h3>{editingId ? 'Termék Szerkesztése' : 'Új Termék Rögzítése'}</h3>
              <form onSubmit={handleAddProduct} style={styles.formGrid}>
                <input type="text" placeholder="Cikkszám" value={newProduct.code} onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })} style={styles.input} />
                <input type="text" placeholder="Termék neve" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={styles.input} />
                <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={styles.input}>
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
                <input type="number" placeholder="Mennyiség" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} style={styles.input} />
                <button type="submit" style={styles.primaryBtn}>{editingId ? 'Mentés' : 'Hozzáadás'}</button>
              </form>
            </div>

            <div style={styles.card}>
              <h3>Termékek ({filteredAndSortedProducts.length})</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Cikkszám</th>
                    <th style={styles.th}>Név</th>
                    <th style={styles.th}>Kategória</th>
                    <th style={styles.th}>Polchely</th>
                    <th style={styles.th}>Menny.</th>
                    <th style={styles.th}>Státusz</th>
                    <th style={styles.th}>Művelet</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedProducts.map((p) => (
                    <tr key={p.id} style={styles.tableRow}>
                      <td style={styles.td}>{p.code}</td>
                      <td style={styles.td}><strong>{p.name}</strong></td>
                      <td style={styles.td}>{p.category}</td>
                      <td style={styles.td}>{p.locationFormat}</td>
                      <td style={styles.td}>{p.quantity}</td>
                      <td style={styles.td}>
                        <span onClick={() => toggleStatus(p.id)} style={{ ...styles.badge, backgroundColor: p.status === 'Kihelyezve' ? '#2e7d32' : '#ed6c02', cursor: 'pointer' }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => handleEditClick(p)} style={styles.editBtn}>Szerk.</button>
                        <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Törlés</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'veko' && (
          <div style={styles.card}>
            <h2>🔄 Tükrözés (6 kártya soronként)</h2>
            <div style={styles.cardGrid}>
              {products.map((p) => (
                <div key={p.id} style={styles.productCard}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{p.code}</span>
                  <h4 style={{ fontSize: '12px', margin: '4px 0' }}>{p.name}</h4>
                  <div style={{ fontSize: '11px' }}>Hely: {p.locationFormat}</div>
                  <select value={p.locationFormat} onChange={(e) => handleAssignLocation(p.id, e.target.value)} style={{ fontSize: '11px', marginTop: '5px' }}>
                    <option value="VEKO/0/000">VEKO/0/000</option>
                    {shelves.map(s => <option key={s.id} value={`${s.name}/1/052`}>{s.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', margin: 0, padding: 0 },
  header: { backgroundColor: '#cc0000', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoArea: { display: 'flex', flexDirection: 'column' },
  title: { margin: 0, fontSize: '20px' },
  subtitle: { fontSize: '12px', opacity: 0.9 },
  nav: { display: 'flex', gap: '10px' },
  navBtn: { backgroundColor: 'transparent', border: 'none', color: '#fff', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' },
  activeNavBtn: { backgroundColor: 'rgba(255, 255, 255, 0.25)', fontWeight: 'bold' },
  main: { padding: '20px', maxWidth: '1400px', margin: '0 auto' },
  card: { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  uploadBtn: { backgroundColor: '#ff9800', color: '#fff', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-block', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' },
  input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
  primaryBtn: { backgroundColor: '#cc0000', color: '#fff', border: 'none', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  tableHeader: { backgroundColor: '#f0f0f0', textAlign: 'left' },
  th: { padding: '10px', fontSize: '12px' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '8px', fontSize: '12px' },
  badge: { color: '#fff', padding: '3px 6px', borderRadius: '10px', fontSize: '10px', display: 'inline-block' },
  editBtn: { backgroundColor: '#1976d2', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', marginRight: '4px' },
  deleteBtn: { backgroundColor: '#d32f2f', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '10px', marginTop: '10px' },
  productCard: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
};
