import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCheck } from 'react-icons/fa';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { db, auth } from '../firebase'; // Import for addToCart logic
import { doc, setDoc, getDoc, collection } from "firebase/firestore";

// Global variable for secure Firestore path construction
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

/**
 * Renders the rating stars based on the score.
 */
const Rating = ({ score }) => {
  const fullStars = Math.floor(score);
  const stars = [];

  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar
        key={i}
        className={i < fullStars ? 'text-yellow-400' : 'text-gray-300'}
      />
    );
  }
  return <div className="flex items-center space-x-1">{stars}</div>;
};

/**
 * Main Product Description Page Component
 */
const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); 
  
  // State for UI controls
  const [selectedColor, setSelectedColor] = useState('#6B8E23'); 
  const [selectedSize, setSelectedSize] = useState('Large'); 
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);

  // --- Data Fetching for Single Product ---
  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found.");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setMainImage(data.images[0]); // Set initial main image
        // Reset controls based on new product
        setQuantity(1);
        setSelectedSize('Large');
        // Simple color guess based on dummy data
        setSelectedColor(data.meta?.barcode === '4897055230004' ? '#333333' : '#6B8E23'); 
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  // --- Handlers ---
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      showNotification("Please log in to add items to cart.", 'error');
      return;
    }

    try {
      const cartCollectionRef = collection(db, "artifacts", appId, "users", user.uid, "cart");
      const cartRef = doc(cartCollectionRef, product.id.toString());
      const docSnap = await getDoc(cartRef);

      const itemToAdd = {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category,
        color: selectedColor,
        size: selectedSize,
      };

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        await setDoc(cartRef, {
          ...itemToAdd,
          quantity: currentData.quantity + quantity,
        }, { merge: true });
      } else {
        await setDoc(cartRef, { ...itemToAdd, quantity: quantity });
      }

      showNotification(`${quantity}x ${product.title} added to cart!`);

    } catch (err) {
      console.error("Error adding to cart:", err);
      const errorMessage = err.message.includes('permission') 
        ? "Permission Denied. Check security rules." 
        : "Failed to add item to cart.";
      showNotification(errorMessage, 'error');
    }
  };
  
  const goBack = () => navigate(-1); // Function to go back to the dashboard

  // --- Loading/Error States ---
  if (loading) return <div className="text-center py-20 text-xl">Loading product details...</div>;
  if (error || !product) return <div className="text-center py-20 text-xl text-red-600">Error: {error || "Product data is missing."}</div>;

  // --- Mock Data for Options (since DummyJSON doesn't have sizes/colors) ---
  const mockSizes = ['Small', 'Medium', 'Large', 'X-Large'];
  const mockColors = [
    { name: 'Olive', hex: '#6B8E23' },
    { name: 'Dark Grey', hex: '#333333' },
    { name: 'Navy', hex: '#191970' },
  ];
  
  // --- Rendering ---
  return (
    <div className="min-h-screen bg-white">
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

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500">
        <span className="hover:text-black cursor-pointer" onClick={() => navigate('/')}>Home</span> &gt;{' '}
        <span className="hover:text-black cursor-pointer" onClick={goBack}>Products</span> &gt;{' '}
        <span className="text-black font-semibold truncate max-w-xs inline-block align-middle">{product.title}</span>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        
        {/* === Left Column: Image Gallery === */}
        <div className="lg:col-span-2 flex flex-col md:flex-row gap-4 md:gap-6">
          
          {/* Thumbnail Selector (Vertical on MD+, Horizontal on Mobile) */}
          <div className="order-2 md:order-1 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-3 overflow-x-auto pb-2 md:pb-0">
            {product.images.slice(0, 4).map((src, index) => (
              <div 
                key={index}
                className={`flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  mainImage === src ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => setMainImage(src)}
              >
                <img src={src} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Main Image (Center) */}
          <div className="order-1 md:order-2 flex-grow max-w-full rounded-xl overflow-hidden shadow-xl">
            <img 
              src={mainImage} 
              alt={product.title} 
              className="w-full h-full object-cover" 
              style={{ minHeight: '300px' }}
            />
          </div>
        </div>

        {/* === Right Column: Details and Controls === */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Title and Rating */}
          <div className="space-y-2 border-b pb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black">
              {product.title}
            </h1>
            <div className="flex items-center space-x-3">
              <Rating score={product.rating} />
              <span className="text-gray-700 font-semibold">{product.rating.toFixed(1)}/5</span>
              <span className="text-gray-400 text-sm">({product.stock + 50} Reviews)</span>
            </div>
          </div>

          {/* Price and Discount */}
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-extrabold text-black">
              ${product.price}
            </span>
            {/* Calculate a mock original price based on discount */}
            <span className="text-2xl text-gray-400 line-through">
              ${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}
            </span>
            <span className="text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
              -{Math.round(product.discountPercentage)}%
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed pt-2">
            {product.description}
          </p>

          <div className="border-t border-gray-200 pt-6 space-y-6">
            
            {/* Color Selection (Mock Data) */}
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-3">Select Colors</p>
              <div className="flex flex-wrap gap-3">
                {mockColors.map((color) => (
                  <div
                    key={color.name}
                    className={`w-8 h-8 rounded-full border-2 p-0.5 cursor-pointer flex items-center justify-center transition-all ${
                      selectedColor === color.hex ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedColor(color.hex)}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor === color.hex && (
                        <FaCheck className="w-full h-full text-white p-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selection (Mock Data) */}
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-3">Choose Size</p>
              <div className="flex flex-wrap gap-3">
                {mockSizes.map((size) => (
                  <button
                    key={size}
                    className={`px-6 py-3 rounded-full border transition-all duration-200 text-sm font-medium ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-black'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart Button (Stacked on mobile) */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex items-center justify-between border border-gray-300 rounded-full w-full sm:w-40 h-14 overflow-hidden flex-shrink-0">
              <button
                className="p-4 hover:bg-gray-100 transition-colors h-full"
                onClick={() => handleQuantityChange(-1)}
                aria-label="Decrease quantity"
              >
                <FiMinus className="text-lg" />
              </button>
              <span className="font-semibold text-lg">{quantity}</span>
              <button
                className="p-4 hover:bg-gray-100 transition-colors h-full"
                onClick={() => handleQuantityChange(1)}
                aria-label="Increase quantity"
              >
                <FiPlus className="text-lg" />
              </button>
            </div>
            
            <button
              className="bg-black text-white font-semibold text-lg rounded-full flex-grow h-14 hover:bg-gray-800 transition-colors"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>

          {/* Stock/Availability Status */}
          <div className="pt-2 text-sm font-medium">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock: {product.stock} units available.</span>
            ) : (
              <span className="text-red-600">Out of Stock.</span>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
