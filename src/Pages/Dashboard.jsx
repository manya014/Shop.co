import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "firebase/auth";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom"; 
import { FiFilter, FiX } from 'react-icons/fi'; // Icons for mobile filter control

// Global variables for secure Firestore path construction and initial auth
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Categories for display (can be dynamic, but static here for simplicity)
const CATEGORIES = ["smartphones", "laptops", "fragrances", "furniture", "groceries", "skincare", "decor"];

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null); 
  const [authReady, setAuthReady] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // NEW: Mobile filter state
  
  const navigate = useNavigate(); 

  // --- Authentication Setup ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthReady(true);
      } else if (initialAuthToken) {
        try {
          await signInWithCustomToken(auth, initialAuthToken);
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

  // --- Data Fetching ---
  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);
      });
  }, []);

  // --- Filtering Logic ---
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    filtered = filtered.filter((p) => p.price <= priceRange[1]);

    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, priceRange, selectedCategory, searchQuery]);

  // --- Handlers ---
  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange([0, value]);
  };

  const viewProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Add to Cart Functionality
  const addToCart = async (product) => {
    const user = auth.currentUser;
    
    if (!user || !authReady) {
      showNotification("Authentication not ready. Please wait.", 'error');
      return;
    }

    try {
      const cartCollectionRef = collection(db, "artifacts", appId, "users", user.uid, "cart");
      const cartRef = doc(cartCollectionRef, product.id.toString());
      const docSnap = await getDoc(cartRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        await setDoc(cartRef, {
          ...product,
          quantity: currentData.quantity + 1,
        }, { merge: true });
      } else {
        await setDoc(cartRef, { ...product, quantity: 1 });
      }

      showNotification(`${product.title} added to cart!`, 'success');

    } catch (err) {
      console.error("Error adding to cart:", err);
      const errorMessage = err.message.includes('permission') 
        ? "Permission Denied. Check security rules." 
        : "Failed to add item to cart.";
        
      showNotification(errorMessage, 'error');
    }
  };

  // --- Filter Sidebar Component ---
  const FilterSidebar = () => (
    <aside className="p-6 bg-white shadow-xl lg:rounded-xl h-full lg:h-auto">
      <h2 className="font-extrabold text-2xl mb-6 text-black">Filters</h2>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-1 transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="mb-8 border-b pb-4">
        <h3 className="font-semibold mb-3 text-lg text-gray-800">Category</h3>
        <ul className="space-y-3">
          {CATEGORIES.map((cat) => (
            <li
              key={cat}
              className={`cursor-pointer capitalize text-gray-600 hover:text-blue-600 transition-colors text-base ${
                selectedCategory === cat ? "text-blue-600 font-bold" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
          {selectedCategory && (
            <button
              className="text-sm text-red-500 font-medium pt-2"
              onClick={() => setSelectedCategory(null)}
            >
              ✕ Clear Category
            </button>
          )}
        </ul>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-lg text-gray-800">Price Range</h3>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer range-lg"
        />
        <p className="text-md text-gray-700 mt-2 font-medium">
          Max Price: <span className="font-extrabold text-black">${priceRange[1]}</span>
        </p>
      </div>
    </aside>
  );

  // --- Main Render ---
  if (!authReady) {
    return (
      <div className="flex w-full justify-center items-center h-screen text-xl bg-gray-50">
        Loading authentication...
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen bg-gray-50">
      
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

      {/* Mobile Filter Button */}
      <button 
        className="fixed bottom-4 right-4 lg:hidden z-40 bg-black text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105"
        onClick={() => setIsFilterOpen(true)}
        aria-label="Open Filters"
      >
        <FiFilter className="w-6 h-6" />
      </button>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto flex">
        
        {/* --- Sidebar (Desktop) --- */}
        <div className="hidden lg:block lg:w-72 p-8 flex-shrink-0">
          <FilterSidebar />
        </div>

        {/* --- Sidebar (Mobile Drawer) --- */}
        <div 
          className={`fixed inset-y-0 left-0 w-80 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <button 
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-black"
              onClick={() => setIsFilterOpen(false)}
            >
              <FiX className="w-6 h-6" />
            </button>
            <FilterSidebar />
            <div className="pt-6">
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
                >
                    Apply Filters
                </button>
            </div>
          </div>
        </div>

        {/* --- Main Content (Catalog) --- */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-black">Product Catalog</h1>
            <p className="text-gray-500 text-lg">
              <span className="font-bold text-black">{filteredProducts.length}</span> results found
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                <div 
                  className="h-48 w-full overflow-hidden"
                  onClick={() => viewProductDetail(product.id)}
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 
                    className="font-bold text-xl text-black truncate mb-1 hover:text-blue-600 transition-colors"
                    onClick={() => viewProductDetail(product.id)}
                  >
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-extrabold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-yellow-500 text-md font-semibold">⭐ {product.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => viewProductDetail(product.id)}
                      className="flex-1 border border-blue-600 text-blue-600 px-3 py-2 rounded-full font-semibold hover:bg-blue-50 transition duration-300 text-sm"
                    >
                      View Product
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg mt-8">
                <h2 className="text-2xl font-bold text-gray-700">No Products Match Your Filters</h2>
                <p className="text-gray-500 mt-2">Try adjusting your price range or clearing the category filter.</p>
            </div>
          )}
        </main>
      </div>
      
      {/* Mobile Drawer Overlay */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}
    </div>
  );
}
