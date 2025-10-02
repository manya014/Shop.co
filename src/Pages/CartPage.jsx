import React, { useState, useEffect } from 'react';
import { getFirestore, collection, doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth'; 
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // <-- NEW IMPORT
// NOTE: Removed 'initializeApp' import

// Global variables provided by the Canvas environment
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Get the services using the default initialized app (assuming initialization occurs elsewhere)
const db = getFirestore(); 
const auth = getAuth(); 


// Component to display a single item in the cart
const CartItem = ({ item, userId, dbInstance }) => {
    
  const cartItemRef = doc(collection(dbInstance, 'artifacts', appId, 'users', userId, 'cart'), item.id.toString());

  // Update quantity in Firestore
  const updateQuantity = async (delta) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    if (newQuantity === item.quantity) return; 

    try {
      await updateDoc(cartItemRef, {
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove item from Firestore
  const removeItem = async () => {
    try {
      await deleteDoc(cartItemRef);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      {/* Product Info */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
        <div className="flex flex-col min-w-0">
          <h3 className="font-semibold text-lg text-black truncate">{item.title}</h3>
          <p className="text-gray-500 text-sm">{item.category}</p>
          <p className="text-xl font-bold text-black mt-1">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        <div className="flex items-center border border-gray-300 rounded-full">
          <button 
            onClick={() => updateQuantity(-1)} 
            disabled={item.quantity <= 1}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-full disabled:opacity-50 transition-colors"
            aria-label="Decrease quantity"
          >
            <FiMinus />
          </button>
          <span className="px-4 font-medium text-black">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(1)} 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-full transition-colors"
            aria-label="Increase quantity"
          >
            <FiPlus />
          </button>
        </div>
        
        {/* Remove Button */}
        <button 
          onClick={removeItem} 
          className="p-3 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
          aria-label="Remove item"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};


// Main Cart Page Component
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  
  const navigate = useNavigate(); // <-- INITIALIZE NAVIGATE

  // 1. Authentication Setup
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
                console.error("Custom token sign-in failed, falling back to anonymous:", error);
                await signInAnonymously(auth);
            } finally {
                setAuthReady(true);
            }
        } else {
            // Fallback for anonymous sign-in if no user/token
            try {
                const { user: anonymousUser } = await signInAnonymously(auth);
                setUserId(anonymousUser.uid);
            } catch (error) {
                console.error("Anonymous sign-in failed:", error);
            } finally {
                setAuthReady(true);
            }
        }
    });

    return () => unsubscribe(); // Cleanup auth listener
  }, []);

  // 2. Real-time Firestore Listener
  useEffect(() => {
    if (!authReady || !userId) return; // Wait for authentication

    setLoading(true);
    
    // Path: /artifacts/{appId}/users/{userId}/cart
    const cartCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'cart');

    // Set up real-time listener for the cart items
    const unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure quantity and price are numbers for calculation
        quantity: Number(doc.data().quantity || 1),
        price: Number(doc.data().price || 0) 
      }));
      setCartItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore cart snapshot error:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup snapshot listener
  }, [authReady, userId]);

  // --- Calculations ---
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 10.00 : 0.00; // Example shipping rule
  const taxRate = 0.05; // 5% tax example
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  // --- Checkout Handler ---
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add items before proceeding to checkout."); // Placeholder alert
      return;
    }
    // Navigate to the checkout page
    navigate('/checkout');
  };


  if (loading || !authReady) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-medium text-gray-700">Loading your cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty!</h2>
        <p className="text-gray-600">Start shopping now to fill it up.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-6 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
        >
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-black mb-10">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* === Left: Cart Items List === */}
        <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} userId={userId} dbInstance={db} />
            ))}
          </div>
        </div>
        
        {/* === Right: Summary === */}
        <div className="lg:w-1/3 bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-medium">${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes ({(taxRate * 100).toFixed(0)}%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-300 mt-6 pt-4 flex justify-between items-center text-xl font-extrabold text-black">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleProceedToCheckout} // <-- ATTACHED HANDLER HERE
            className="w-full mt-8 bg-green-600 text-white font-semibold py-3 rounded-full hover:bg-green-700 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      
      {/* Display user ID for debugging/sharing (MANDATORY) */}
      <div className="mt-10 text-sm text-gray-400">
          Your Firestore Cart ID: <span className="font-mono text-xs">{userId}</span>
      </div>
    </div>
  );
};

export default CartPage;
