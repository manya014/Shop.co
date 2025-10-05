import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import AdminLoginPage from "./Pages/AdminLoginPage"; // Assuming this exists
import { AuthProvider } from "./Context/AuthProvider";
import Navbar from "./Components/Navbar.jsx";
//hello
import HomePage from "./Pages/HomePage";
import Footer from "./Components/Footer";
import Dashboard from "./Pages/Dashboard";
import ProductPage from "./Pages/ProductsPage";
import CartPage from "./Pages/CartPage";
import Checkout from "./Pages/Checkout";
import Admin from "./Pages/Admin";
import Logout from "./Pages/Logout";
import ProtectedRoute from "./Components/ProtectedRoute"; 
import { ThemeProvider } from "./Context/ThemeContext";// The general auth check component

export default function App() {
  const location = useLocation();
  
  // Find paths that hide the header/footer
  const hideHeaderFooter =
    location.pathname === "/login" || 
    location.pathname === "/signup" ||
    location.pathname === "/admin-login"; // Hide on admin login page

  return (
    <div className="font-sans">
      <ThemeProvider>
      <AuthProvider>
        {!hideHeaderFooter && <Navbar />}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Admin Specific Routes (Public access for the login form) */}
          <Route path="/admin-login" element={<AdminLoginPage />} /> 

          {/* ------------------------------------------------------------- */}
          {/* Protected Routes (Redirect to /login by default) */}
          {/* ------------------------------------------------------------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />

          {/* ------------------------------------------------------------- */}
          {/* Admin Route (Protected by simple login, redirects to /admin-login) */}
          {/* ------------------------------------------------------------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute redirectPath="/admin-login"> 
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Public Product Page */}
          <Route path="/product/:productId" element={<ProductPage />} />
        </Routes>

        {!hideHeaderFooter && <Footer />}
      </AuthProvider>
      </ThemeProvider>
    </div>
  );
}
