import React, { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "firebase/auth";
import { db, auth, storage } from "../firebase"; // Make sure you export storage from your firebase.js
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useTheme } from "../context/ThemeContext";

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const initialProductState = {
  title: "",
  price: 0,
  description: "",
  thumbnail: "https://placehold.co/100x100/CCCCCC/333333?text=Product",
  stock: 10,
  category: "New Product",
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialProductState);
  const [editingId, setEditingId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { theme } = useTheme();

  // --- Authentication ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) setUserId(user.uid), setAuthReady(true);
      else if (initialAuthToken) {
        try { const cred = await signInWithCustomToken(auth, initialAuthToken); setUserId(cred.user.uid); }
        catch { await signInAnonymously(auth); }
        finally { setAuthReady(true); }
      } else { await signInAnonymously(auth); setAuthReady(true); }
    });
    return () => unsubscribe();
  }, []);

  // --- Firestore listener ---
  useEffect(() => {
    if (!authReady || !userId) return;
    const refCollection = collection(db, "artifacts", appId, "users", userId, "admin_products");
    const unsubscribe = onSnapshot(refCollection, snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data(), price: Number(d.data().price) }));
      setProducts(data);
    });
    return () => unsubscribe();
  }, [authReady, userId]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `products/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, thumbnail: url }));
      showNotification("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      showNotification("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const showNotification = (message, type='success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!userId) return showNotification("Authentication required", "error");
    try {
      const refCollection = collection(db, "artifacts", appId, "users", userId, "admin_products");
      if (editingId) {
        await setDoc(doc(refCollection, editingId), formData);
        setEditingId(null);
        showNotification("Product updated!");
      } else {
        await addDoc(refCollection, formData);
        showNotification("Product added!");
      }
      setFormData(initialProductState);
    } catch {
      showNotification("Failed to save product", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteDoc(doc(db, "artifacts", appId, "users", userId, "admin_products", id));
      showNotification("Product deleted");
    } catch {
      showNotification("Failed to delete product", "error");
    }
  };

  const handleEditClick = (p) => { setFormData(p); setEditingId(p.id); window.scrollTo(0,0); };
  const handleCancelEdit = () => { setFormData(initialProductState); setEditingId(null); };

  if (!authReady) return (
    <div className={`flex justify-center items-center h-screen ${theme==='dark'?'bg-gray-900 text-white':'bg-white text-black'}`}>Loading...</div>
  );

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${theme==='dark'?'bg-gray-900 text-white':'bg-white text-black'}`}>
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl font-bold ${notification.type==='success'?'bg-green-600':'bg-red-600'} text-white`}>
          {notification.message}
        </div>
      )}

      <header className="max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold">{editingId ? "Edit Product" : "Product Management"}</h1>
      </header>

      {/* Product Form */}
      <div className={`max-w-4xl mx-auto p-8 shadow-2xl mb-12 rounded-xl
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className={`w-full p-3 rounded-lg border
              ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50 text-black'} font-bold`}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full p-3 rounded-lg border
              ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50 text-black'} font-bold`}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className={`p-3 rounded-lg border
                ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50 text-black'} font-bold`}
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleInputChange}
              className={`p-3 rounded-lg border
                ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50 text-black'} font-bold`}
              required
            />
          </div>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full p-3 rounded-lg border
              ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50 text-black'} font-bold`}
          />

          {/* File Upload */}
          <div>
            <label className="block mb-2 font-semibold">Upload Image:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="w-full" />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {formData.thumbnail && <img src={formData.thumbnail} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
          </div>

          <div className="flex space-x-4 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center p-3 rounded-full bg-black text-white font-bold hover:bg-gray-700"
            >
              <FaSave className="mr-2" /> {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 flex items-center justify-center p-3 rounded-full bg-gray-500 text-white font-bold hover:bg-gray-600"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-6">Managed Products ({products.length})</h2>
        {products.length === 0 ? (
          <p className={`p-6 rounded-xl shadow ${theme==='dark'?'bg-gray-800 text-gray-200':'bg-gray-200 text-black'}`}>
            No products found. Add your first product above.
          </p>
        ) : (
          <div className="space-y-4">
            {products.map(p => (
              <div key={p.id} className={`flex items-center p-4 rounded-xl shadow ${theme==='dark'?'bg-gray-800':'bg-gray-200'}`}>
                <img src={p.thumbnail} alt={p.title} className="w-16 h-16 object-cover rounded-lg mr-4" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{p.title}</h3>
                  <p className="text-sm">{p.price.toFixed(2)}$ | Stock: {p.stock}</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={()=>handleEditClick(p)} className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"><FaEdit /></button>
                  <button onClick={()=>handleDeleteProduct(p.id)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
