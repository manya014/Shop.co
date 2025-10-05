import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import useTheme from '../Hooks/useTheme';
import { useNavigate } from 'react-router-dom';

const StatItem = ({ count, label }) => (
  <div className="text-left mb-4 sm:mb-0">
    <p className="text-2xl sm:text-3xl font-extrabold text-black dark:text-black">{count}</p>
    <p className="text-gray-600 dark:text-gray-900 text-sm mt-1">{label}</p>
  </div>
);


const HomePage = () => {
  const [hovered, setHovered] = useState(null);
  const { theme } = useTheme();
  const brands = ['ELECTRONICS', 'MAKEUP', 'CLOTHING', 'UTILITIES', 'ACCESSORIES'];
  const isDark = theme === 'dark';
const navigate = useNavigate();

  return (
    
    <div className={`w-full transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Upper Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start relative pt-12 lg:pt-20 xl:pt-24 pb-12 px-4 sm:px-6">
        
        {/* Left Column */}
        <div className="flex-1 z-10 text-center lg:text-left">
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
            FIND PRODUCTS THAT MATCH YOUR STYLE
          </h1>

          <p className={`mt-4 sm:mt-6 text-base sm:text-lg max-w-md mx-auto lg:mx-0 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Browse our diverse range of meticulously crafted products, designed to highlight your individuality and sense of style.
          </p>

          <button
      onClick={() => navigate('/dashboard')} // Navigate to Browse Collection
      className={`mt-6 sm:mt-8 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors duration-200 ${
        isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      Shop Now
    </button>


          {/* Stats */}
          <div className={`flex flex-col sm:flex-row justify-center lg:justify-start mt-8 sm:mt-12 space-y-4 sm:space-y-0 sm:space-x-8 border-t border-t-black dark:border-t-black pt-6`}>
            <StatItem count="200+" label="International Brands" />
            <StatItem count="2,000+" label="High-Quality Products" />
            <StatItem count="30,000+" label="Happy Customers" />
          </div>
        </div>

        {/* Right Column (hidden on mobile) */}
        <div className="flex-1 relative min-h-[300px] lg:min-h-[400px] mt-10 lg:mt-0 hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-lg"
            style={{
              backgroundImage: isDark
                ? 'url(/beautiful-pieces-woman-modeling-dark.png)'
                : 'url(/beautiful-pieces-woman-modeling.png)',
              backgroundPosition: '50% 10%',
            }}
          />
          {/* Star Decorations */}
          <span className={`absolute top-4 right-4 text-6xl transform rotate-45 ${isDark ? 'text-white' : 'text-black'}`}>
            <FaStar />
          </span>
          <span className={`absolute bottom-1/3 left-1/2 -ml-8 text-4xl transform rotate-45 ${isDark ? 'text-white' : 'text-black'}`}>
            <FaStar />
          </span>
        </div>
      </div>

      {/* Brand Logos */}
      <div className={`py-6 lg:py-8 mt-12 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex justify-start sm:justify-between items-center space-x-6 sm:space-x-4">
            {brands.map((brand, index) => (
              <h2
                key={index}
                className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider ${isDark ? 'text-gray-200' : 'text-white'} flex-shrink-0`}
              >
                {brand}
              </h2>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Panels */}
      <div
        className={`relative h-64 sm:h-[350px] md:h-[400px] lg:h-[500px] w-full max-w-6xl overflow-hidden rounded-xl shadow-sm px-4 sm:px-10 mx-auto my-10 transition-colors duration-300 ${
          isDark ? 'bg-gray-800 shadow-lg' : 'bg-white'
        }`}
      >
        {/* Center Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none transition-opacity duration-500 text-center px-4">
          <div className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide ${isDark ? 'text-white' : 'text-black'}`}>
            SHOP.CO
          </div>
        </div>

        {/* Left Panel */}
        <div
          onMouseEnter={() => setHovered('left')}
          onMouseLeave={() => setHovered(null)}
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out
            ${hovered === 'left' ? 'w-full z-30' : 'w-16 sm:w-20 z-20'}
            cursor-pointer flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-900'}`}
        >
          <img
            src={isDark ? '/image11-dark.png' : '/image11.png'}
            alt="Fashion"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
              ${hovered === 'left' ? 'opacity-100' : 'opacity-0'}`}
          />
          <h2 className={`text-xs sm:text-sm md:text-xl font-bold rotate-90 z-10 whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-white'}`}>
            Trendy Fashion
          </h2>
        </div>

        {/* Right Panel */}
        <div
          onMouseEnter={() => setHovered('right')}
          onMouseLeave={() => setHovered(null)}
          className={`absolute top-0 right-0 h-full transition-all duration-500 ease-in-out
            ${hovered === 'right' ? 'w-full z-30' : 'w-16 sm:w-20 z-20'}
            cursor-pointer flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-900'}`}
        >
          <img
            src={isDark ? '/image111-dark.png' : '/image111.png'}
            alt="Utility"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
              ${hovered === 'right' ? 'opacity-100' : 'opacity-0'}`}
          />
          <h2 className={`text-xs sm:text-sm md:text-xl font-bold rotate-90 z-10 whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-white'}`}>
            Daily Utility
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
