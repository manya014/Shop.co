import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Import auth instance

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // 1. Perform the Firebase sign out
        await signOut(auth);
        console.log("User successfully signed out.");
        
        // 2. Redirect the user to the home page or login page after successful logout
        navigate('/login', { replace: true }); 
      } catch (error) {
        console.error("Logout error:", error);
        // If sign-out fails (e.g., network error), redirect anyway, but show an error
        navigate('/login', { replace: true });
      }
    };

    handleLogout();
  }, [navigate]);

  // Display a simple message while the process happens
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold text-black mb-4">Logging out...</h1>
      <p className="text-gray-600">You will be redirected shortly.</p>
    </div>
  );
};

export default Logout;

