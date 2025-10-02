import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import auth instance

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@shop.co');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      
      // On success, redirect to the admin dashboard
      navigate('/admin');

    } catch (err) {
      console.error("Admin login failed:", err);
      // Display a friendly error message
      setError('Login failed. Please check your credentials or network connection.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-black mb-6 text-center">Admin Login</h1>
        <p className="text-gray-500 mb-6 text-center text-sm">Use dummy credentials (admin@shop.co / password) to proceed.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
          
          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Log In as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
