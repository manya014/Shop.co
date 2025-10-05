import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import useTheme from '../Hooks/useTheme';

const FooterLink = ({ href, children, isDark }) => (
  <li>
    <a
      href={href}
      className={`transition-colors duration-200 text-sm ${
        isDark ? 'text-stone-300 hover:text-stone-50' : 'text-stone-600 hover:text-stone-900'
      }`}
    >
      {children}
    </a>
  </li>
);

const FooterSection = ({ title, links, isDark }) => (
  <div>
    <h3 className={`text-lg font-semibold mb-4 uppercase ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
      {title}
    </h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <FooterLink key={index} href={link.href} isDark={isDark}>
          {link.text}
        </FooterLink>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    <footer className={`${isDark ? 'bg-stone-900' : 'bg-stone-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* SHOP.CO Info & Socials */}
          <div className="col-span-2 md:col-span-1">
            <h3 className={`text-3xl font-extrabold mb-4 ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
              SHOP.CO
            </h3>
            <p className={`text-sm mb-6 max-w-xs ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              We have clothes that suits your style and which you’re proud to wear. From women to men.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`p-2 border rounded-full transition-colors duration-200 ${
                  isDark
                    ? 'border-stone-700 hover:bg-stone-800'
                    : 'border-stone-300 hover:bg-stone-100'
                }`}
              >
                <FaTwitter className={`${isDark ? 'text-stone-50' : 'text-stone-600'} w-5 h-5`} />
              </a>
              <a
                href="#"
                className={`p-2 border rounded-full transition-colors duration-200 ${
                  isDark
                    ? 'border-stone-700 hover:bg-stone-800'
                    : 'border-stone-300 hover:bg-stone-100'
                }`}
              >
                <FaFacebookF className={`${isDark ? 'text-stone-50' : 'text-stone-600'} w-5 h-5`} />
              </a>
              <a
                href="#"
                className={`p-2 border rounded-full transition-colors duration-200 ${
                  isDark
                    ? 'border-stone-700 hover:bg-stone-800'
                    : 'border-stone-300 hover:bg-stone-100'
                }`}
              >
                <FaInstagram className={`${isDark ? 'text-stone-50' : 'text-stone-600'} w-5 h-5`} />
              </a>
              <a
                href="#"
                className={`p-2 border rounded-full transition-colors duration-200 ${
                  isDark
                    ? 'border-stone-700 hover:bg-stone-800'
                    : 'border-stone-300 hover:bg-stone-100'
                }`}
              >
                <FaGithub className={`${isDark ? 'text-stone-50' : 'text-stone-600'} w-5 h-5`} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <FooterSection title="COMPANY" links={companyLinks} isDark={isDark} />
          <FooterSection title="HELP" links={helpLinks} isDark={isDark} />
          <FooterSection title="FAQ" links={faqLinks} isDark={isDark} />
          <FooterSection title="RESOURCES" links={resourcesLinks} isDark={isDark} />
        </div>
      </div>

      {/* Copyright */}
      <div className={`border-t py-6 px-4 sm:px-6 lg:px-8 ${isDark ? 'border-stone-700' : 'border-stone-300'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            Shop.co © 2000-2023, All Rights Reserved
          </p>
          <div className="flex space-x-2 mt-4 md:mt-0">
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
