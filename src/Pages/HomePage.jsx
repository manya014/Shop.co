import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
/**
 * A reusable component for the stats section.
 * @param {string} count The main large number/count.
 * @param {string} label The text description for the count.
 */
const StatItem = ({ count, label }) => (
  <div className="text-left">
    <p className="text-3xl font-extrabold text-black">{count}</p>
    <p className="text-gray-600 text-sm mt-1">{label}</p>
  </div>
);

/**
 * The HomePage component.
 */
const HomePage = () => {
  const [hovered, setHovered] = useState(null);

  // Array of brand names to display at the bottom
  const brands = ['ELECTRONICS', 'MAKEUP', 'CLOTHING', 'UTILITIES', 'ACCESORIES'];

  return (
    <div className="w-full bg-gray-50">
      {/* Upper Content Area */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row relative overflow-hidden pt-12 lg:pt-20 xl:pt-24 pb-12">
        
        {/* Left Content Column */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 z-10 py-10 lg:py-0">
          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl font-extrabold text-black leading-tight max-w-xl">
            FIND PRODUCTS THAT MATCHES YOUR STYLE
          </h1>

          {/* Description */}
          <p className="text-gray-600 max-w-md mt-6 text-base">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>

          {/* Call to Action Button */}
          <button className="mt-8 bg-black text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors duration-200">
            Shop Now
          </button>

          {/* Statistics Section */}
          <div className="flex space-x-10 mt-12 pt-4 border-t border-gray-300">
            <StatItem count="200+" label="International Brands" />
            <StatItem count="2,000+" label="High-Quality Products" />
            <StatItem count="30,000+" label="Happy Customers" />
          </div>
        </div>

        {/* Right Image Column */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/beautiful-pieces-woman-modeling.png)', 
              backgroundPosition: '50% 10%',
            }}
          />

          {/* Star decorations */}
          <span className="absolute top-10 right-4 lg:right-10 text-6xl text-black transform rotate-45"><FaStar/></span>
          <span className="absolute bottom-1/3 left-1/2 -ml-8 text-4xl text-black transform rotate-45"><FaStar></FaStar></span>
        </div>
      </div>

      {/* Brand Logos Section */}
      <div className="bg-black py-6 lg:py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center space-x-4">
            {brands.map((brand, index) => (
              <h2
                key={index}
                className={`text-white text-3xl sm:text-4xl font-extrabold tracking-wider ${brand === 'PRADA' ? 'text-opacity-100' : 'text-opacity-80'}`}
              >
                {brand}
              </h2>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Hover Panels */}
     <div className="relative h-64 sm:h-[500px] w-full max-w-6xl bg-white overflow-hidden rounded-xl shadow-sm px-6 sm:px-10 mx-auto my-10">
        {/* Center Logo and Tagline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none transition-opacity duration-500 text-center px-4">

          <div className="text-6xl font-extrabold tracking-wide text-black">
        SHOP.CO
      </div>
        </div>

        {/* Left Expandable Panel */}
        <div
          onMouseEnter={() => setHovered('left')}
          onMouseLeave={() => setHovered(null)}
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out
            ${hovered === 'left' ? 'w-full z-30' : 'w-20 z-20'}
            bg-[#080808] cursor-pointer flex items-center justify-center overflow-hidden`}
        >
          <img
            src="/image11.png"
            alt="Fashion"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
              ${hovered === 'left' ? 'opacity-100' : 'opacity-0'}`}
          />
          <h2 className="text-sm sm:text-xl font-bold text-[#ffffff] rotate-90 z-10 whitespace-nowrap">Trendy Fashion</h2>
        </div>

        {/* Right Expandable Panel */}
        <div
          onMouseEnter={() => setHovered('right')}
          onMouseLeave={() => setHovered(null)}
          className={`absolute top-0 right-0 h-full transition-all duration-500 ease-in-out
            ${hovered === 'right' ? 'w-full z-30' : 'w-20 z-20'}
            bg-[#080808] cursor-pointer flex items-center justify-center overflow-hidden`}
        >
          <img
            src="/image111.png"
            alt="Utility"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
              ${hovered === 'right' ? 'opacity-100' : 'opacity-0'}`}
          />
          <h2 className="text-sm sm:text-xl font-bold text-[#ffffff] rotate-90 z-10 whitespace-nowrap">Daily Utility</h2>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
