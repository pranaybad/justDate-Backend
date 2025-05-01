import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout"; // Import the Logout component

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token")); // Use state to track token

  // Update token state when it's changed in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    // Listen for changes to localStorage (in case it's modified outside of this component)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Only run this effect on mount and unmount

  return (
    <nav className="bg-blue-500 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-semibold">
          <Link to="/home">MyApp</Link>
        </div>

        <ul className="flex space-x-6 text-white">
          {/* Show Login and SignUp only if the user is not logged in */}
          {!token ? (
            <>
              <li>
                <Link to="/" className="hover:text-blue-200">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-200">Sign Up</Link>
              </li>
            </>
          ) : (
            // Pass setToken to Logout component
            <li>
              <Logout setToken={setToken} />
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
