import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "firebase/auth";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom"; 
import { FiFilter, FiX } from 'react-icons/fi';
import { useTheme } from "../Context/ThemeContext";

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const CATEGORIES = ["smartphones", "laptops", "fragrances", "furniture", "groceries", "skincare", "decor"];

export default function Dashboard() {
  const [adminProducts, setAdminProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null); 
  const [authReady, setAuthReady] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { theme } = useTheme();

  const navigate = useNavigate();
  //hellp

  // Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) setAuthReady(true);
      else if (initialAuthToken) {
        try { await signInWithCustomToken(auth, initialAuthToken); }
        catch { await signInAnonymously(auth); }
        finally { setAuthReady(true); }
      } else { await signInAnonymously(auth); setAuthReady(true); }
    });
    return () => unsubscribe(); 
  }, []);

  // Fetch admin products
  useEffect(() => {
    const fetchAdminProducts = async () => {
      try {
        const adminCollectionRef = collection(db, "artifacts", appId, "products");
        const snapshot = await getDocs(adminCollectionRef);
        const productsFromAdmin = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isAdmin: true }));
        setAdminProducts(productsFromAdmin);
      } catch (err) { console.error(err); }
    };
    if (authReady) fetchAdminProducts();
  }, [authReady]);

  // Fetch dummy products
  useEffect(() => {
    if (!authReady) return;
    fetch("https://dummyjson.com/products?limit=100")
      .then(res => res.json())
      .then(data => {
        const merged = [...adminProducts, ...data.products];
        setProducts(merged);
        setFilteredProducts(merged);
      });
  }, [adminProducts, authReady]);

  // Filtering
  useEffect(() => {
    let filtered = [...products];
    if (selectedCategory) filtered = filtered.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    filtered = filtered.filter(p => p.price <= priceRange[1]);
    if (searchQuery.trim()) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredProducts(filtered);
  }, [products, priceRange, selectedCategory, searchQuery]);

  const handlePriceChange = (e) => setPriceRange([0, Number(e.target.value)]);
  const viewProductDetail = (productId) => navigate(`/product/${productId}`);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = async (product) => {
    const user = auth.currentUser;
    if (!user || !authReady) return showNotification("Authentication not ready.", 'error');
    try {
      const cartCollectionRef = collection(db, "artifacts", appId, "users", user.uid, "cart");
      const cartRef = doc(cartCollectionRef, product.id.toString());
      const docSnap = await getDoc(cartRef);
      if (docSnap.exists()) await setDoc(cartRef, { ...product, quantity: docSnap.data().quantity + 1 }, { merge: true });
      else await setDoc(cartRef, { ...product, quantity: 1 });
      showNotification(`${product.title} added to cart!`, 'success');
    } catch { showNotification("Failed to add item to cart.", 'error'); }
  };

  const FilterSidebar = () => (
    <aside className={`p-6 shadow-xl lg:rounded-xl h-full lg:h-auto ${theme==='dark'?'bg-gray-700 text-gray-200':'bg-white text-black'}`}>
      <h2 className="font-extrabold text-2xl mb-6">Filters</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full px-4 py-3 border focus:ring-1 focus:border-gray-600 transition-colors
            ${theme==='dark'?'bg-gray-600 border-gray-500 text-gray-200':'bg-gray-50 border-gray-300 text-black'}`}
        />
      </div>

      <div className="mb-8 border-b pb-4">
        <h3 className="font-semibold mb-3 text-lg">Category</h3>
        <ul className="space-y-3">
          {CATEGORIES.map(cat => (
            <li
              key={cat}
              className={`cursor-pointer capitalize hover:text-gray-800 transition-colors text-base ${selectedCategory===cat?'font-bold underline':''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
          {selectedCategory && (
            <button className="text-sm text-gray-500 font-medium pt-2" onClick={() => setSelectedCategory(null)}>✕ Clear Category</button>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-lg">Price Range</h3>
        <input type="range" min="0" max="500" value={priceRange[1]} onChange={handlePriceChange} className="w-full h-2 rounded-lg bg-gray-300 appearance-none cursor-pointer" />
        <p className="mt-2 font-medium">Max Price: <span className="font-extrabold">${priceRange[1]}</span></p>
      </div>
    </aside>
  );

  if (!authReady) return <div className={`flex justify-center items-center h-screen ${theme==='dark'?'bg-gray-900 text-gray-200':'bg-white text-black'}`}>Loading authentication...</div>;

  return (
    <div className={`relative min-h-screen ${theme==='dark'?'bg-gray-900 text-gray-200':'bg-white text-black'}`}>
      {notification && <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl font-bold ${notification.type==='success'?'bg-black':'bg-gray-800'} text-white`}>{notification.message}</div>}

      <button className="fixed bottom-4 right-4 lg:hidden z-40 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform" onClick={() => setIsFilterOpen(true)} aria-label="Open Filters"><FiFilter className="w-6 h-6" /></button>

      <div className="max-w-7xl mx-auto flex">
        <div className="hidden lg:block lg:w-72 p-8 flex-shrink-0 sticky top-10 self-start">
  <FilterSidebar />
</div>
        <div className={`fixed inset-y-0 left-0 w-80 z-50 transform transition-transform duration-300 lg:hidden ${isFilterOpen?'translate-x-0':'-translate-x-full'}`}>
          <div className={`p-6 h-full overflow-y-auto ${theme==='dark'?'bg-gray-700 text-gray-200':'bg-white text-black'}`}>
            <button className="absolute top-4 right-4 p-2 hover:text-black text-gray-600" onClick={() => setIsFilterOpen(false)}><FiX className="w-6 h-6" /></button>
            <FilterSidebar />
            <div className="pt-6">
              <button onClick={() => setIsFilterOpen(false)} className="w-full bg-black text-white font-semibold py-3 hover:bg-gray-800">Apply Filters</button>
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold">Product Catalog</h1>
            <p className="text-lg"><span className="font-bold">{filteredProducts.length}</span> results found</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className={`rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col cursor-pointer relative ${theme==='dark'?'bg-gray-800':'bg-white'}`}>
                {product.isAdmin && <span className="text-xs bg-gray-600 px-2 py-1 rounded-full absolute top-2 right-2 font-semibold">Admin</span>}
                <div className="h-48 w-full overflow-hidden" onClick={() => viewProductDetail(product.id)}>
                  <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className={`font-bold text-xl truncate mb-1 hover:underline cursor-pointer ${theme==='dark'?'text-gray-200':'text-black'}`} onClick={() => viewProductDetail(product.id)}>{product.title}</h3>
                  <p className={`text-sm mb-3 line-clamp-2 flex-grow ${theme==='dark'?'text-gray-400':'text-gray-600'}`}>{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold">{product.price.toFixed(2)}$</span>
                    <span className={`text-sm font-semibold ${theme==='dark'?'text-gray-400':'text-gray-800'}`}>⭐ {product.rating?.toFixed(1)}</span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button onClick={() => viewProductDetail(product.id)} className={`flex-1 border border-gray-600 px-3 py-2 font-semibold hover:bg-gray-100 transition duration-300 text-sm ${theme==='dark'?'text-gray-200':'text-black'}`}>View Product</button>
                    <button onClick={() => addToCart(product)} className={`flex-1 bg-black text-white px-3 py-2 font-semibold hover:bg-gray-800 transition duration-300 text-sm`}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className={`text-center py-20 shadow-lg mt-8 ${theme==='dark'?'bg-gray-800 text-gray-400':'bg-white text-gray-600'}`}>
              <h2 className="text-2xl font-bold">No Products Match Your Filters</h2>
              <p className="mt-2">Try adjusting your price range or clearing the category filter.</p>
            </div>
          )}
        </main>
      </div>

      {isFilterOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)}></div>}
    </div>
  );
}
