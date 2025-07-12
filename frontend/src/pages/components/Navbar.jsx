import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to login/signup page using React Router
    navigate('/login');
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
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <div className="text-2xl font-bold text-black cursor-pointer" onClick={handleHome}>
        ClothSwap
      </div>
      <nav className="flex space-x-6 text-sm font-medium">
        <button onClick={handleHome} className="hover:text-black transition-colors duration-200">
          Home
        </button>
        <a href="#" className="hover:text-black transition-colors duration-200">Browse</a>
        <button onClick={handleHowItWorks} className="hover:text-black transition-colors duration-200">
          How It Works
        </button>
        <a href="#" className="hover:text-black transition-colors duration-200">About</a>
      </nav>
      <div className="space-x-4">
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
    </header>
  );
}
