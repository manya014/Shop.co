import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import useTheme from '../Hooks/useTheme'; // make sure path is correct

const StatItem = ({ count, label }) => (
  <div className="text-left">
    <p className="text-3xl font-extrabold text-black dark:text-white">{count}</p>
    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{label}</p>
  </div>
);

const HomePage = () => {
  const [hovered, setHovered] = useState(null);
  const { theme } = useTheme(); // get current theme
  const brands = ['ELECTRONICS', 'MAKEUP', 'CLOTHING', 'UTILITIES', 'ACCESORIES'];

  const isDark = theme === 'dark';

  return (
    <div className={`w-full transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Upper Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row relative overflow-hidden pt-12 lg:pt-20 xl:pt-24 pb-12">
        {/* Left Column */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 z-10 py-10 lg:py-0">
          <h1 className={`text-5xl sm:text-7xl font-extrabold leading-tight max-w-xl ${isDark ? 'text-white' : 'text-black'}`}>
            FIND PRODUCTS THAT MATCHES YOUR STYLE
          </h1>

          <p className={`max-w-md mt-6 text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>

          <button
            className={`mt-8 font-semibold px-8 py-4 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Shop Now
          </button>

          <div className={`flex space-x-10 mt-12 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <StatItem count="200+" label="International Brands" />
            <StatItem count="2,000+" label="High-Quality Products" />
            <StatItem count="30,000+" label="Happy Customers" />
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: isDark
                ? 'url(/beautiful-pieces-woman-modeling-dark.png)'
                : 'url(/beautiful-pieces-woman-modeling.png)',
              backgroundPosition: '50% 10%',
            }}
          />
          {/* Star Decorations */}
          <span className={`absolute top-10 right-4 lg:right-10 text-6xl transform rotate-45 ${isDark ? 'text-white' : 'text-black'}`}>
            <FaStar />
          </span>
          <span className={`absolute bottom-1/3 left-1/2 -ml-8 text-4xl transform rotate-45 ${isDark ? 'text-white' : 'text-black'}`}>
            <FaStar />
          </span>
        </div>
      </div>

      {/* Brand Logos */}
      <div className={`py-6 lg:py-8 mt-12 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center space-x-4">
            {brands.map((brand, index) => (
              <h2
                key={index}
                className={`text-3xl sm:text-4xl font-extrabold tracking-wider ${isDark ? 'text-gray-200' : 'text-white'} text-opacity-80`}
              >
                {brand}
              </h2>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Hover Panels */}
      <div
        className={`relative h-64 sm:h-[500px] w-full max-w-6xl overflow-hidden rounded-xl shadow-sm px-6 sm:px-10 mx-auto my-10 transition-colors duration-300 ${
          isDark ? 'bg-gray-800 shadow-lg' : 'bg-white'
        }`}
      >
        {/* Center Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none transition-opacity duration-500 text-center px-4">
          <div className={`text-6xl font-extrabold tracking-wide ${isDark ? 'text-white' : 'text-black'}`}>
            SHOP.CO
          </div>
        </div>

        {/* Left Panel */}
        <div
          onMouseEnter={() => setHovered('left')}
          onMouseLeave={() => setHovered(null)}
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out
            ${hovered === 'left' ? 'w-full z-30' : 'w-20 z-20'}
            cursor-pointer flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-900'}`}
        >
          <img
            src={isDark ? '/image11-dark.png' : '/image11.png'}
            alt="Fashion"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
              ${hovered === 'left' ? 'opacity-100' : 'opacity-0'}`}
          />
          <h2 className={`text-sm sm:text-xl font-bold rotate-90 z-10 whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-white'}`}>
            Trendy Fashion
          </h2>
        </div>

        {/* Right Panel */}
        <div
          onMouseEnter={() => setHovered('right')}
          onMouseLeave={() => setHovered(null)}
          className={`absolute top-0 right-0 h-full transition-all duration-500 ease-in-out
            ${hovered === 'right' ? 'w-full z-30' : 'w-20 z-20'}
            cursor-pointer flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-900'}`}
        >
          <img
            src={isDark ? '/image111-dark.png' : '/image111.png'}
            alt="Utility"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
              ${hovered === 'right' ? 'opacity-100' : 'opacity-0'}`}
          />
          <h2 className={`text-sm sm:text-xl font-bold rotate-90 z-10 whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-white'}`}>
            Daily Utility
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
