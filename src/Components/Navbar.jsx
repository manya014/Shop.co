import React from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router-dom"; // Make sure 'react-router-dom' is installed

const Navbar = () => {
  // Define links data for cleaner rendering
  const navLinks = [
    // Correctly routes to the product listing page
    { name: "Browse Collection", path: "/dashboard", dropdown: true }, 
    // Correctly routes to the admin product management page
    { name: "Manage Collection", path: "/admin" }, 
  ];

  // Function to apply active styles
  const getNavLinkClass = ({ isActive }) =>
    `font-medium hover:text-black transition-colors ${
      isActive ? "text-black border-b-2 border-black" : "text-gray-600"
    }`;

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="text-2xl font-extrabold tracking-wide text-black flex-shrink-0">
        <NavLink to="/" className="hover:text-gray-800">
          SHOP.CO
        </NavLink>
      </div>

      {/* Center: Links & Search */}
      <div className="flex items-center space-x-12">
        {/* Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="flex items-center">
              <NavLink to={link.path} className={getNavLinkClass}>
                {link.name}
              </NavLink>
              {link.dropdown && <IoIosArrowDown className="text-lg ml-1 cursor-pointer text-gray-600 hover:text-black" />}
            </div>
          ))}
        </div>

        {/* Search Bar (Desktop) */}
        
      </div>

      {/* Right: Icons (Cart and User) */}
      <div className="flex items-center space-x-6 text-xl text-gray-800 flex-shrink-0">
        {/* Search icon for mobile/small screens */}
        <FiSearch className="cursor-pointer hover:text-black md:hidden" />
        
        {/* Cart Icon - NOW ROUTES TO /cart */}
        <NavLink to="/cart" title="Shopping Cart">
            <FiShoppingCart className="cursor-pointer hover:text-black" />
        </NavLink>
        
        {/* User Icon - Placeholder for Profile/Login route */}
        <NavLink to="/login" title="User Account"> 
            <FiUser className="cursor-pointer hover:text-black" />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
