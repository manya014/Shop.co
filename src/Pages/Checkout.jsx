import React, { useState, useEffect } from 'react';
import { FaShippingFast, FaCreditCard, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { db, auth } from '../firebase'; // Import auth and db instances

// Global variables for secure Firestore path construction and initial auth
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Step Components (Unchanged) ---

const ShippingStep = ({ onNext }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold mb-4">1. Shipping Information</h3>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="text" placeholder="Full Name" className="p-3 border rounded-lg" required />
      <input type="email" placeholder="Email Address" className="p-3 border rounded-lg" required />
      <input type="text" placeholder="Street Address" className="p-3 border rounded-lg col-span-full" required />
      <input type="text" placeholder="City" className="p-3 border rounded-lg" required />
      <input type="text" placeholder="State / Province" className="p-3 border rounded-lg" required />
      <input type="text" placeholder="Zip / Postal Code" className="p-3 border rounded-lg" required />
    </form>
    <button onClick={onNext} className="mt-6 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
      Continue to Payment
    </button>
  </div>
);

const PaymentStep = ({ onNext, onBack }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold mb-4">2. Payment Method</h3>
    <div className="bg-gray-100 p-6 rounded-xl space-y-4">
      <label className="flex items-center space-x-3 p-3 border border-blue-500 bg-white rounded-lg cursor-pointer shadow-md">
        <input type="radio" name="paymentMethod" defaultChecked />
        <span className="font-semibold">Credit/Debit Card (Visa, MasterCard)</span>
      </label>
      <label className="flex items-center space-x-3 p-3 border border-gray-200 bg-white rounded-lg cursor-pointer">
        <input type="radio" name="paymentMethod" />
        <span className="font-semibold">PayPal</span>
      </label>
    </div>
    
    <form className="space-y-4">
      <input type="text" placeholder="Card Number" className="p-3 border rounded-lg w-full" required />
      <input type="text" placeholder="Name on Card" className="p-3 border rounded-lg w-full" required />
      <div className="grid grid-cols-3 gap-4">
        <input type="text" placeholder="MM/YY" className="p-3 border rounded-lg" required />
        <input type="text" placeholder="CVC" className="p-3 border rounded-lg" required />
      </div>
    </form>
    
    <div className="flex justify-between pt-4">
      <button onClick={onBack} className="text-gray-600 hover:text-black font-semibold">
        &larr; Back to Shipping
      </button>
      <button onClick={onNext} className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
        Review Order
      </button>
    </div>
  </div>
);

const ReviewStep = ({ onPlaceOrder, onBack, total }) => ( // Added 'total' prop
  <div className="space-y-6">
    <h3 className="text-xl font-bold mb-4">3. Review and Place Order</h3>
    
    <div className="border p-4 rounded-xl bg-white shadow-sm">
      <h4 className="font-semibold mb-2">Ship To:</h4>
      <p className="text-sm text-gray-700">John Doe</p>
      <p className="text-sm text-gray-700">123 Commerce St, New York, NY 10001</p>
    </div>

    <div className="border p-4 rounded-xl bg-white shadow-sm">
      <h4 className="font-semibold mb-2">Pay With:</h4>
      <p className="text-sm text-gray-700">Visa ending in **** 1234</p>
    </div>

    <div className="flex justify-between pt-4">
      <button onClick={onBack} className="text-gray-600 hover:text-black font-semibold">
        &larr; Back to Payment
      </button>
      <button onClick={onPlaceOrder} className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
        Place Order (${total.toFixed(2)}) {/* Use dynamic total */}
      </button>
    </div>
  </div>
);

const ProcessingStep = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <FaSpinner className="animate-spin text-6xl text-blue-600 mb-6" />
      <h3 className="text-2xl font-bold text-black">Processing Payment...</h3>
      <p className="text-gray-600 mt-2">Please wait, do not close this window.</p>
    </div>
);

const SuccessStep = ({ onNewOrder }) => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <FaCheckCircle className="text-8xl text-green-500 mb-6" />
      <h3 className="text-3xl font-extrabold text-black">Order Placed Successfully!</h3>
      <p className="text-gray-600 mt-2">Your order number is #XYZ123. A confirmation email has been sent.</p>
      <button 
        onClick={onNewOrder} 
        className="mt-8 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
);


// --- Main Checkout Component ---
const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  // --- New State for Cart Data ---
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  
  // --- Firebase Setup (Same as CartPage) ---
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

  // --- Real-time Firestore Listener for Cart ---
  useEffect(() => {
    if (!authReady || !userId) return;

    const cartCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'cart');

    const unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        quantity: Number(doc.data().quantity || 1),
        price: Number(doc.data().price || 0) 
      }));
      setCartItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore cart snapshot error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authReady, userId]);


  // --- Dynamic Calculations ---
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 10.00 : 0.00;
  const taxRate = 0.05; 
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;


  // --- Step Handlers ---
  const stepComponents = [
    { id: 1, title: 'Shipping', icon: FaShippingFast, component: ShippingStep },
    { id: 2, title: 'Payment', icon: FaCreditCard, component: PaymentStep },
    { id: 3, title: 'Review', icon: FaCheckCircle, component: ReviewStep },
  ];

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty! Cannot place order.");
        return;
    }
    // 1. Move to Processing state
    setStep(4); 
    
    // 2. Simulate API/Payment processing delay (3 seconds)
    setTimeout(() => {
        // 3. Move to Success state
        setStep(5);
    }, 3000); 
  };
  
  const handleNewOrder = () => {
      navigate('/dashboard');
  };

  const getStepComponent = () => {
      if (step === 4) return ProcessingStep;
      if (step === 5) return () => <SuccessStep onNewOrder={handleNewOrder} />;
      
      return stepComponents.find(s => s.id === step)?.component;
  };
  
  const CurrentStepComponent = getStepComponent();

  const isFinalStep = step >= 4;

  if (loading || !authReady) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-600 mr-2" />
        <div className="text-xl font-medium text-gray-700">Loading cart data...</div>
      </div>
    );
  }
  
  if (cartItems.length === 0 && step < 4) {
      return (
          <div className="max-w-4xl mx-auto py-20 text-center">
              <h2 className="text-3xl font-bold mb-4 text-red-600">Cart Empty!</h2>
              <p className="text-gray-600">You must have items in your cart to proceed to checkout.</p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-black mb-12">Secure Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* === Left Column: Steps and Form/Status === */}
          <div className={`lg:w-2/3 bg-white p-8 rounded-xl shadow-lg border border-gray-100 ${isFinalStep ? 'w-full lg:flex-none lg:w-3/4 mx-auto' : ''}`}>
            
            {/* Step Indicator (Hidden on Processing/Success) */}
            {!isFinalStep && (
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
                {stepComponents.map((s, index) => (
                    <div key={s.id} className="flex flex-col items-center relative">
                    <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 ${
                        step === s.id 
                            ? 'bg-black text-white shadow-lg'
                            : step > s.id 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                        <s.icon className="w-5 h-5" />
                    </div>
                    <p className={`mt-2 text-sm font-medium ${step >= s.id ? 'text-black' : 'text-gray-500'}`}>{s.title}</p>
                    
                    {index < stepComponents.length - 1 && (
                        <div 
                        className={`absolute left-full top-5 w-16 h-0.5 transform -translate-x-1/2 transition-colors duration-300 ${
                            step > s.id ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ transform: 'translateX(-50%)' }}
                        ></div>
                    )}
                    </div>
                ))}
                </div>
            )}

            {/* Current Step Component */}
            {CurrentStepComponent && (
              <CurrentStepComponent
                onNext={() => setStep(step + 1)}
                onBack={() => setStep(step - 1)}
                onPlaceOrder={handlePlaceOrder}
                total={total} // Pass total to ReviewStep
              />
            )}
            
          </div>
          
          {/* === Right Column: Order Summary (Hidden on Success) === */}
          {!isFinalStep && (
              <div className="lg:w-1/3 h-fit">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6 border-b pb-4 max-h-48 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-700">
                        <span>{item.title} (x{item.quantity})</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

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
                      <span>Taxes ({taxRate * 100}%):</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-300 mt-6 pt-4 flex justify-between items-center text-xl font-extrabold text-black">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-200 rounded-xl text-sm text-gray-600">
                  Your data is encrypted. All transactions are secure.
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
