import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token } = useContext(AuthContext); // Get token from context
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-3xl font-extrabold tracking-tight">
          <Link to="/home" className="flex items-center space-x-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>JustDate</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-white items-center">
          {!token ? (
            <>
              <li>
                <Link
                  to="/"
                  className="relative text-lg font-medium hover:text-indigo-200 transition-colors duration-300 group"
                >
                  Login
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="relative text-lg font-medium hover:text-indigo-200 transition-colors duration-300 group"
                >
                  Sign Up
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Logout />
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-10 backdrop-blur-lg mt-4 rounded-xl p-4 animate-slide-down">
          <ul className="flex flex-col space-y-4 text-white">
            {!token ? (
              <>
                <li>
                  <Link
                    to="/"
                    onClick={toggleMobileMenu}
                    className="block text-lg font-medium hover:text-indigo-200 transition-colors duration-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    onClick={toggleMobileMenu}
                    className="block text-lg font-medium hover:text-indigo-200 transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Logout onClick={toggleMobileMenu} />
              </li>
            )}
          </ul>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
