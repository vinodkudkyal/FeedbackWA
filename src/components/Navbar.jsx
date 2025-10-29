import React, { useState } from 'react';
import { Home, FileText, HelpCircle, MessageCircleQuestion, Contact, LogIn } from 'lucide-react';
import '../index.css';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} />, path: '/' },
    { id: 'feedback', label: 'Feedback Form', icon: <FileText size={20} />, path: '/feedback' },
    { id: 'instructions', label: 'Instructions', icon: <HelpCircle size={20} />, path: '/instructions' },
    { id: 'faq', label: 'FAQ', icon: <MessageCircleQuestion size={20} />, path: '/faq' },
    { id: 'contact', label: 'Contact Us', icon: <Contact size={20} />, path: '/contact' }
  ];

  const handleClick = (id) => {
    setActiveTab(id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <h1 
                onClick={() => handleClick('home')}
                className="text-white font-bold text-2xl select-none hover:opacity-80 transition-all duration-200 cursor-pointer"
              >
                StudentScope
              </h1>
              <span className="text-white/80 text-sm font-medium hidden sm:block select-none">
                | Faculty Evaluation Portal
              </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center">
              <div className="flex space-x-1 mr-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item.id)}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 cursor-pointer select-none
                      ${activeTab === item.id 
                        ? 'bg-white text-blue-600 shadow-md transform scale-105' 
                        : 'text-white hover:bg-white/20'
                      }
                    `}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Login Button */}
              <button 
                onClick={() => handleClick('login')}
                className={`
                  flex items-center px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 cursor-pointer select-none
                  ${activeTab === 'login' 
                    ? 'bg-white text-blue-600 shadow-md transform scale-105' 
                    : 'bg-white/10 text-white hover:bg-white/30 border border-white/30'
                  }
                `}
              >
                <LogIn size={20} className="mr-2" />
                <span className="hidden sm:inline">Login</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;