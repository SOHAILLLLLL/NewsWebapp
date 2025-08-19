// Helper components for SVG Icons
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const AppsIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 8h-2v-2h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2zm4-8h-2v-2h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2zm4-8h-2v-2h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2zm4-8h-2v-2h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2zm4-8h-2v-2h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2z" />
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// --- Navbar Component ---
const Navbar = ({ isAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Check if the current path is '/login'
  if (location.pathname === '/login') {
    return null; // Don't render the navbar
  }
  const handleSearch = (e) => {
    // e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };
  const navLinks = ['home', 'chatbot', 'business', 'entertainment', 'politics', 'sport', 'tech',];
  
  return (
    <header className="bg-[#202124] text-gray-300 border-b border-gray-700">
      {/* Top Navigation Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo & Menu */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-400 hover:text-white">
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_74x24dp.png" alt="Google Logo" className="h-6 mr-2 opacity-90" />
              <span className="text-2xl font-medium text-gray-200">News</span>
            </div>
          </div>

          {/* Center Section: Search Bar */}
          <div className="hidden md:flex flex-grow items-center justify-center px-8">
            <div className="w-full max-w-2xl relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon className="h-5 w-5" />
              </span>
              <input
    type="text"
    placeholder="Search for topics, locations & sources"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={(e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }}
    id="mySearchInput"
    className="w-full bg-[#303134] text-gray-200 rounded-lg py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
/>
            </div>
          </div>

          {/* Right Section: Icons & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="md:hidden p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700">
              <SearchIcon className="h-6 w-6" />
            </button>
            <button className="hidden sm:block p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700">
              <SettingsIcon className="h-6 w-6" />
            </button>
            <button className="hidden sm:block p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700">
              <AppsIcon className="h-6 w-6" />
            </button>

            {/* --- Conditional Auth UI --- */}
            {isAuthenticated ? (
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer" title="User Profile">
                U
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Login</Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Links */}
      <nav className={`hidden md:block border-t border-gray-800`}>
        <div className="container mx-auto px-4">
          <ul className="flex items-center space-x-2 overflow-x-auto" style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
            {navLinks.map(link => (
              <li key={link}>
                <Link
                  to={`${link.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setActiveTab(link)}
                  className={`block whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === link
                    ? 'text-blue-400 border-b-4 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#202124] border-t border-gray-700">
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map(link => (
              <Link
                to={`${link.toLowerCase().replace(' ', '-')}`}
                key={link}
                onClick={() => {
                  setActiveTab(link);
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === link
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                {link}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-700 mt-2">
                <Link href="/login" className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Login</Link>
                <Link href="/signup" className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
export default Navbar;