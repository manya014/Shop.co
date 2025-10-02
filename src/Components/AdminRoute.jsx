import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '../Context/AuthProvider'; // Assuming you use this or similar auth hook
import { auth } from '../firebase'; // Import auth instance

/**
 * A wrapper component to protect routes that require administration access.
 * NOTE: This is a basic authentication check. For production, you must verify 
 * the user's role (e.g., check custom claims or a user document in Firestore).
 */
const AdminRoute = ({ children }) => {
  // Using a simple check on auth.currentUser for demonstration
  const user = auth.currentUser;
  
  const isAuthenticated = !!user; // true if a user is logged in
  const isLoading = false; // Replace with a real loading state if using hooks

  if (isLoading) {
    return <div className="text-center py-10">Checking authentication...</div>;
  }

  // If user is not authenticated, redirect them to the admin login page
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  // If authenticated, render the child component (AdminPage)
  return children ? children : <Outlet />;
};

export default AdminRoute;
