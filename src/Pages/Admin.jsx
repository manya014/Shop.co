import React, { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "firebase/auth";
import { db, auth } from "../firebase"; // Assuming these are correctly set up
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

// Global variables for secure Firestore path construction and initial auth
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initial state for the product form
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
  const [editingId, setEditingId] = useState(null); // ID of the product being edited
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [notification, setNotification] = useState(null);

  // --- Authentication Setup ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setAuthReady(true);
      } else if (initialAuthToken) {
        try {
          const credential = await signInWithCustomToken(auth, initialAuthToken);
          setUserId(credential.user.uid);
        } catch (error) {
          await signInAnonymously(auth);
        } finally {
          setAuthReady(true);
        }
      } else {
        await signInAnonymously(auth);
        setAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Firestore Real-time Listener (Read Products) ---
  useEffect(() => {
    if (!authReady || !userId) return;

    // Path: /artifacts/{appId}/users/{userId}/admin_products
    const productsCollectionRef = collection(db, "artifacts", appId, "users", userId, "admin_products");
    
    // Listen for changes in the user's managed products
    const unsubscribe = onSnapshot(productsCollectionRef, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        price: Number(doc.data().price),
      }));
      setProducts(productList);
    }, (error) => {
      console.error("Error fetching admin products:", error);
    });

    return () => unsubscribe();
  }, [authReady, userId]); // Dependency on auth status and user ID

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // --- CRUD Operations ---

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!userId) {
      showNotification("Authentication required.", 'error');
      return;
    }
    
    try {
      const productsCollectionRef = collection(db, "artifacts", appId, "users", userId, "admin_products");

      if (editingId) {
        // Update existing product
        const productRef = doc(productsCollectionRef, editingId);
        await setDoc(productRef, formData);
        showNotification("Product updated successfully!");
        setEditingId(null);
      } else {
        // Add new product
        await addDoc(productsCollectionRef, formData);
        showNotification("Product added successfully!");
      }
      setFormData(initialProductState); // Clear form
    } catch (error) {
      console.error("Error saving product:", error);
      showNotification("Failed to save product. Check permissions.", 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    if (!userId) return;

    try {
      const productRef = doc(db, "artifacts", appId, "users", userId, "admin_products", id);
      await deleteDoc(productRef);
      showNotification("Product deleted.");
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Failed to delete product.", 'error');
    }
  };

  const handleEditClick = (product) => {
    setFormData(product);
    setEditingId(product.id);
    window.scrollTo(0, 0); // Scroll to form
  };

  const handleCancelEdit = () => {
    setFormData(initialProductState);
    setEditingId(null);
  };

  // --- Render ---

  if (!authReady) {
    return (
      <div className="flex w-full justify-center items-center h-screen text-lg">
        Loading authentication...
      </div>
    );
  }
  
  // Admin UI
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Notification Bar */}
      {notification && (
          <div 
              className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl text-white ${
                  notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
          >
              {notification.message}
          </div>
      )}

      <header className="max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-black">Product Management Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage products in your private Firestore collection.</p>
        <p className="text-xs mt-4 text-gray-500">
            Current User ID (Admin Context): <span className="font-mono">{userId}</span>
        </p>
      </header>

      {/* --- Add/Edit Product Form --- */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          {editingId ? <><FaEdit className="mr-2" /> Edit Product</> : <><FaPlus className="mr-2" /> Add New Product</>}
        </h2>
        
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price ($)"
              value={formData.price}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <input
            type="text"
            name="thumbnail"
            placeholder="Image URL (Thumbnail)"
            value={formData.thumbnail}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="flex space-x-4 pt-2">
            <button
              type="submit"
              className={`flex-1 flex items-center justify-center p-3 rounded-full text-white font-semibold transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              <FaSave className="mr-2" /> {editingId ? 'Update Product' : 'Add Product'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center justify-center p-3 rounded-full bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition-colors"
              >
                <FaTimes className="mr-2" /> Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- Product List --- */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Managed Products ({products.length})</h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500 p-6 bg-white rounded-xl shadow">No products found. Use the form above to add your first product.</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition duration-200 border border-gray-100"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 mr-4"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                  <p className="text-sm text-gray-500">${product.price.toFixed(2)} | Stock: {product.stock}</p>
                </div>

                <div className="flex space-x-3 flex-shrink-0">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                    title="Edit Product"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Delete Product"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

