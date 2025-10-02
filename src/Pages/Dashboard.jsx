import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase"; // Assuming these are correctly set up
import { useNavigate } from "react-router-dom"; 

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate(); // Initialize navigate hook

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

  // Navigate to the product detail page
  const viewProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Add to Cart Functionality (using Firebase)
  const addToCart = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to add items to cart.");
      return;
    }

    try {
      const cartRef = doc(collection(db, "users", user.uid, "cart"), product.id.toString());
      const docSnap = await getDoc(cartRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        await setDoc(cartRef, {
          ...product,
          quantity: currentData.quantity + 1,
        });
      } else {
        await setDoc(cartRef, { ...product, quantity: 1 });
      }

      alert(`${product.title} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
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
    </div>
  );
}