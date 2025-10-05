import React, { useState } from "react";
import { FiShoppingCart, FiUser, FiSearch, FiSun, FiMoon } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { useTheme } from "../Context/ThemeContext";

const Navbar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Browse Collection", path: "/dashboard", dropdown: true },
    { name: "Manage Collection", path: "/admin" },
  ];

  const getNavLinkClass = ({ isActive }) =>
    `font-medium hover:text-green-500 transition-colors ${
      isActive ? "text-green-500 border-b-2 border-green-500" : theme === "dark" ? "text-white" : "text-black"
    }`;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className={`w-full shadow-sm px-6 py-4 flex items-center justify-between relative ${theme === "dark" ? "bg-gray-900" : "bg-greenTheme-500"}`}>
      {/* Left: Logo */}
      <div className={`text-2xl font-extrabold tracking-wide ${theme === "dark" ? "text-white" : "text-black"} flex-shrink-0`}>
        <NavLink to="/" className="hover:text-gray-300">SHOP.CO</NavLink>
      </div>

      {/* Center Links */}
      <div className="flex items-center space-x-12">
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="flex items-center">
              <NavLink to={link.path} className={getNavLinkClass}>{link.name}</NavLink>
              {link.dropdown && <IoIosArrowDown className="text-lg ml-1 cursor-pointer" />}
            </div>
          ))}
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-6 text-xl flex-shrink-0 relative">
        <FiSearch className="cursor-pointer hover:text-gray-400 md:hidden" />
        <NavLink to="/cart" title="Shopping Cart">
          <FiShoppingCart className={`cursor-pointer ${theme === "dark" ? "text-white hover:text-gray-300" : "text-black hover:text-white"}`} />
        </NavLink>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${theme === "dark" ? "text-yellow-300" : "text-black"}`}
          title="Toggle Theme"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <FiUser
            className={`cursor-pointer ${theme === "dark" ? "text-white hover:text-gray-300" : "text-black hover:text-white"}`}
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          />
          {userDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-36 rounded-lg shadow-lg border z-50 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-greenTheme-100 border-greenTheme-200"}`}>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors rounded-lg text-white font-semibold"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { navigate("/login"); setUserDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors rounded-lg text-white font-semibold"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
