import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleBrowse = () => {
    // Navigate to browse page
    navigate('/browse');
    closeMobileMenu();
  };

  const handleAbout = () => {
    // Navigate to about page
    navigate('/about');
    closeMobileMenu();
  };

  const handleMessages = () => {
    // Navigate to messages page
    navigate('/messages');
    closeMobileMenu();
  };

  const handleLogin = () => {
    // Navigate to login/signup page using React Router
    navigate('/login');
    closeMobileMenu();
  };

    const handleDash = () => {
    // Navigate to login/signup page using React Router
    navigate('/dashboard');
    closeMobileMenu();
  };

  const handleHowItWorks = () => {
    // Smooth scroll to How It Works section
    const howItWorksSection = document.querySelector('#how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    closeMobileMenu();
  };

  const handleHome = () => {
    // Navigate to home and scroll to top
    navigate('/');
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }, 100);
    closeMobileMenu();
  };

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      {/* Logo */}
      <div className="text-xl sm:text-2xl font-bold text-black cursor-pointer" onClick={handleHome}>
        ClothSwap
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        <button onClick={handleHome} className="hover:text-black transition-colors duration-200">
          Home
        </button>
        <button onClick={handleBrowse} className="hover:text-black transition-colors duration-200">Browse</button>
        <button onClick={handleHowItWorks} className="hover:text-black transition-colors duration-200">
          How It Works
        </button>
        <button onClick={handleAbout} className="hover:text-black transition-colors duration-200">About</button>
        <button onClick={handleMessages} className="hover:text-black transition-colors duration-200">Messages</button>
         <button 
              onClick={handleDash}
              className="hover:text-black transition-colors duration-200"
            >
              Dashboard
            </button>
      </nav>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex space-x-4">
        
        <button 
          onClick={handleLogin}
          className="text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
        >
          Login
        </button>
        <button 
          onClick={handleLogin}
          className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Sign Up
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
        aria-label="Toggle mobile menu"
      >
        <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="text-xl font-bold text-black">
            ClothSwap
          </div>
          <button 
            onClick={closeMobileMenu}
            className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="flex flex-col p-6 space-y-6">
          <button 
            onClick={handleHome} 
            className="text-left text-lg font-medium text-gray-700 hover:text-black transition-colors duration-200 py-2"
          >
            Home
          </button>
          <button 
            onClick={handleBrowse} 
            className="text-left text-lg font-medium text-gray-700 hover:text-black transition-colors duration-200 py-2"
          >
            Browse
          </button>
          <button 
            onClick={handleHowItWorks} 
            className="text-left text-lg font-medium text-gray-700 hover:text-black transition-colors duration-200 py-2"
          >
            How It Works
          </button>
          <button 
            onClick={handleAbout} 
            className="text-left text-lg font-medium text-gray-700 hover:text-black transition-colors duration-200 py-2"
          >
            About
          </button>
          <button 
            onClick={handleMessages} 
            className="text-left text-lg font-medium text-gray-700 hover:text-black transition-colors duration-200 py-2"
          >
            Messages
          </button>
          
          {/* Mobile Auth Buttons */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full text-left text-lg font-medium text-gray-700 hover:text-black transition-colors duration-200 py-2"
            >
              Login
            </button>
            <button 
              onClick={handleLogin}
              className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-center font-medium"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
