import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "firebase/auth"; // Import auth methods
import { db, auth } from "../firebase"; // Assuming these are correctly set up
import { useNavigate } from "react-router-dom"; 

// Global variables for secure Firestore path construction and initial auth
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null; // Get token

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null); 
  const [authReady, setAuthReady] = useState(false); // NEW: State to track auth status
  
  const navigate = useNavigate(); 

  // --- 1. Authentication Setup (Crucial Fix) ---
  // Ensure the user is signed in (via token or anonymously) before allowing cart actions.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthReady(true);
      } else if (initialAuthToken) {
        try {
          // Use custom token for Canvas environment
          await signInWithCustomToken(auth, initialAuthToken);
        } catch (error) {
          console.error("Custom token sign-in failed, falling back to anonymous:", error);
          await signInAnonymously(auth);
        } finally {
          setAuthReady(true);
        }
      } else {
        // Sign in anonymously if no user or token is available
        await signInAnonymously(auth);
        setAuthReady(true);
      }
    });
    return () => unsubscribe(); // Cleanup auth listener
  }, []);


  // --- 2. Data Fetching ---
  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);
      });
  }, []);

  // --- 3. Filtering Logic ---
  useEffect(() => {
    // ... Filtering logic remains the same ...
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price filter
    filtered = filtered.filter((p) => p.price <= priceRange[1]);

    // Search filter
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

  // Add to Cart Functionality (using Firebase)
  const addToCart = async (product) => {
    const user = auth.currentUser;
    
    // Check for user AND auth readiness
    if (!user || !authReady) {
      setNotification({ type: 'error', message: "Authentication not ready. Please wait." });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      // Correct secure Firestore path: /artifacts/{appId}/users/{userId}/cart
      const cartCollectionRef = collection(db, "artifacts", appId, "users", user.uid, "cart");
      const cartRef = doc(cartCollectionRef, product.id.toString());
      const docSnap = await getDoc(cartRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        await setDoc(cartRef, {
          ...product,
          quantity: currentData.quantity + 1,
        }, { merge: true }); // Use merge for safety
      } else {
        await setDoc(cartRef, { ...product, quantity: 1 });
      }

      setNotification({ type: 'success', message: `${product.title} added to cart!` });
      setTimeout(() => setNotification(null), 3000);

    } catch (err) {
      console.error("Error adding to cart:", err);
      // Log the error message to the user for debugging
      const errorMessage = err.message.includes('permission') 
        ? "Permission Denied. Check security rules." 
        : "Failed to add item to cart.";
        
      setNotification({ type: 'error', message: errorMessage });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
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

      {/* Show a loading state if authentication isn't ready */}
      {!authReady ? (
        <div className="flex w-full justify-center items-center h-screen text-lg">
          Loading authentication...
        </div>
      ) : (
        <>
          {/* Sidebar Filters */}
          <aside className="w-72 p-6 bg-white shadow-lg rounded-xl flex-shrink-0">
            <h2 className="font-bold text-lg mb-6">Filters</h2>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full border rounded-lg px-3 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Category</h3>
              <ul className="space-y-2">
                {["smartphones", "laptops", "fragrances", "furniture", "groceries"].map((cat) => (
                  <li
                    key={cat}
                    className={`cursor-pointer capitalize ${
                      selectedCategory === cat ? "text-blue-600 font-bold" : "hover:text-blue-500"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </li>
                ))}
                {selectedCategory && (
                  <button
                    className="text-sm text-red-500 mt-2"
                    onClick={() => setSelectedCategory(null)}
                  >
                    ✕ Clear Category
                  </button>
                )}
              </ul>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Price</h3>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Up to: <span className="font-bold">${priceRange[1]}</span>
              </p>
            </div>
          </aside>

          {/* Product Catalog */}
          <main className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">All Products</h1>
              <p className="text-gray-500">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 p-4 flex flex-col"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="rounded-lg h-48 w-full object-cover mb-4 cursor-pointer"
                    onClick={() => viewProductDetail(product.id)}
                  />
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-gray-500 text-sm truncate">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-green-600">
                      ${product.price}
                    </span>
                    <span className="text-yellow-500 text-sm">⭐ {product.rating}</span>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => viewProductDetail(product.id)}
                      className="flex-1 border border-blue-600 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition duration-300"
                    >
                      View Product
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      )}
    </div>
  );
}
