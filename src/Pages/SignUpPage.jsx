// src/components/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(userCredential.user);
      setMessage("A verification email has been sent. Please check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F6F5F3]">
      {/* Left Card Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
        <div className="bg-white shadow-md rounded-2xl w-full max-w-md px-8 py-10">
          <h1 className="text-2xl font-bold text-[#ff6b4a] mb-1">Inventra</h1>
          <p className="text-gray-500 text-sm">Create a new account</p>
          <h2 className="text-3xl font-bold mt-4 mb-6">Sign Up</h2>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff6b4a] text-white font-medium py-2 rounded-md hover:bg-[#e95b3e] transition-all"
            >
              SIGN UP
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#ff6b4a] font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Illustration */}
      <div className="hidden lg:flex w-1/2 bg-[#FBEDE5] items-center justify-center relative">
        <img
          src="/Property 1=Group 2014.png" // <-- place your downloaded illustration in public/ folder
          alt="Signup Illustration"
          className="w-[70%] max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
