import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

/**
 * A reusable link component.
 * @param {string} href The URL to link to.
 * @param {string} children The link text.
 */
const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="text-gray-600 hover:text-black transition-colors duration-200 text-sm">
      {children}
    </a>
  </li>
);

/**
 * A section for links in the footer.
 * @param {string} title The title of the section (e.g., 'COMPANY').
 * @param {Array<Object>} links An array of link objects: [{ text, href }].
 */
const FooterSection = ({ title, links }) => (
  <div>
    <h3 className="text-lg font-semibold text-black mb-4 uppercase">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <FooterLink key={index} href={link.href}>
          {link.text}
        </FooterLink>
      ))}
    </ul>
  </div>
);

/**
 * The main Footer component.
 */
const Footer = () => {
  const companyLinks = [
    { text: 'About', href: '#' },
    { text: 'Features', href: '#' },
    { text: 'Works', href: '#' },
    { text: 'Career', href: '#' },
  ];

  const helpLinks = [
    { text: 'Customer Support', href: '#' },
    { text: 'Delivery Details', href: '#' },
    { text: 'Terms & Conditions', href: '#' },
    { text: 'Privacy Policy', href: '#' },
  ];

  const faqLinks = [
    { text: 'Account', href: '#' },
    { text: 'Manage Deliveries', href: '#' },
    { text: 'Orders', href: '#' },
    { text: 'Payments', href: '#' },
  ];

  const resourcesLinks = [
    { text: 'Free eBooks', href: '#' },
    { text: 'Development Tutorial', href: '#' },
    { text: 'How to - Blog', href: '#' },
    { text: 'Youtube Playlist', href: '#' },
  ];

  return (
    <footer className="bg-white">
      {/* Newsletter Section - Black Bar */}
          {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Shop.co Info & Socials */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-3xl font-extrabold text-black mb-4">SHOP.CO</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-xs">
              We have clothes that suits your style and which you’re proud to wear. From women to men.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons - Requires 'react-icons' */}
              <a href="#" className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <FaTwitter className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <FaFacebookF className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <FaInstagram className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <FaGithub className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <FooterSection title="COMPANY" links={companyLinks} />
          <FooterSection title="HELP" links={helpLinks} />
          <FooterSection title="FAQ" links={faqLinks} />
          <FooterSection title="RESOURCES" links={resourcesLinks} />
        </div>
      </div>

      {/* Copyright and Payment Methods */}
      <div className="border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>
            Shop.co © 2000-2023, All Rights Reserved
          </p>
          <div className="flex space-x-2 mt-4 md:mt-0">
            {/* Payment Icons - Using simple colored boxes as placeholders for visual representation */}
            <span className="h-6 w-10 bg-blue-700 text-white flex items-center justify-center rounded text-xs font-bold">VISA</span>
            <span className="h-6 w-10 bg-red-600 text-white flex items-center justify-center rounded text-xs font-bold">MAST</span>
            <span className="h-6 w-10 bg-yellow-400 text-white flex items-center justify-center rounded text-xs font-bold">DISC</span>
            <span className="h-6 w-14 bg-blue-500 text-white flex items-center justify-center rounded text-xs font-bold">PayPal</span>
            <span className="h-6 w-10 bg-gray-400 text-white flex items-center justify-center rounded text-xs font-bold">@Pay</span>
            <span className="h-6 w-10 bg-green-500 text-white flex items-center justify-center rounded text-xs font-bold">G Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;