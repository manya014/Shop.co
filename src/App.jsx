import { Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import { AuthProvider } from './Context/AuthProvider';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Footer from './Components/Footer';
import Dashboard from './Pages/Dashboard';
import ProductPage from './Pages/ProductsPage'; // <-- NEW IMPORT: Import the Product Page component
import CartPage from './pages/CartPage';
import Checkout from './Pages/Checkout';
import Admin from './Pages/Admin';

export default function App() {
  const location = useLocation(); // Hook to get current path

  // Hide Navbar and Footer on login & signup pages
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="font-sans">
      <AuthProvider>
        {/* Navbar only appears on pages other than login/signup */}
        {!hideHeaderFooter && <Navbar />} 
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Dashboard (Product Listing Page) */}
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/cart" element={<CartPage />} /> 
          <Route path="/checkout" element={<Checkout />} /> 
          
          {/* NEW ROUTE: Product Description Page (PDP) */}
          <Route path="/product/:productId" element={<ProductPage />} /> 

          <Route path="/admin" element={<Admin />} />
          {/* Add other routes below */}
        </Routes>
        
        {/* Footer also hidden on login/signup pages */}
        {!hideHeaderFooter && <Footer />} 
      </AuthProvider>
    </div>
  );
}