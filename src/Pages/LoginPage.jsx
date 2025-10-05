import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    loginWithEmail,
    loginWithGoogle,
    resetPassword,
    loading,
    error,
    message,
  } = useAuthStore();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = await loginWithEmail(email, password);
    if (user) navigate("/dashboard");
  };

  const handleGoogleLogin = async () => {
    const user = await loginWithGoogle();
    if (user) navigate("/dashboard");
  };

  const handleForgotPassword = () => resetPassword(email);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-gray-300/50">
            <div className="text-2xl font-extrabold tracking-wide text-black">
              SHOP.CO
            </div>
            <h2 className="text-3xl font-bold text-black mt-4 mb-6">Log in</h2>

            {error && (
              <div className="mb-4 p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-300">
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800">Email</label>
                <input
                  type="email"
                  placeholder="test@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-gray-400 rounded-lg bg-gray-50 focus:ring-gray-600 focus:border-gray-600 placeholder-gray-400 text-gray-700 transition duration-150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800">Password</label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg bg-gray-50 focus:ring-gray-600 focus:border-gray-600 placeholder-gray-400 text-gray-700 transition duration-150"
                  />
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500 hover:text-black"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center p-3 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-gray-300"
                }`}
              >
                {loading ? "Signing In..." : "SIGN IN"}
              </button>
            </form>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm font-medium"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              {loading ? "Signing In..." : "Sign in with Google"}
            </button>

            <div className="mt-8 text-center text-sm">
              <p className="text-gray-600">
                Don’t have an account?
                <Link to="/signup" className="ml-2 font-bold text-black hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-200 relative overflow-hidden p-12">
          <div className="relative z-10 w-full max-w-lg h-full flex items-center justify-center">
            <svg viewBox="0 0 800 600" className="w-full h-auto max-h-[80vh]">
              <path d="M0 50h800M0 150h800M0 250h800M0 350h800M0 450h800M0 550h800" stroke="#ccc" strokeWidth="2" strokeDasharray="10, 10"/>
              <path d="M100 0v600M200 0v600M300 0v600M400 0v600M500 0v600M600 0v600M700 0v600" stroke="#ccc" strokeWidth="2" strokeDasharray="10, 10"/>
            </svg>
            <img src="/img.png" alt="" className="filter grayscale" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
