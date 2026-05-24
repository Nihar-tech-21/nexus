import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/authContext.jsx";

function Navbar() {
  const { user, logout, signOut } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileRef = useRef(null);
  const navigate = useNavigate();

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-950/90 backdrop-blur-sm shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center m-3">
        {/* Logo / Brand - preserved original sizing and text */}
        <Link
          to="/"
          className="text-4xl flex font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400"
        >
          {/* keep image size stable so it doesn't crush */}
          <img
            src="/NexusLogo.png"
            alt="NexusLogo"
            className="w-12 h-12 object-contain mx-5"
          />
          Nexus
        </Link>

        {/* Desktop Links (unchanged) */}
        <div className="space-x-6 hidden md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-fuchsia-300 transition text-lg font-medium ${
                isActive ? "text-fuchsia-400" : "text-gray-200"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `hover:text-fuchsia-300 transition text-lg font-medium ${
                isActive ? "text-fuchsia-100" : "text-gray-200"
              }`
            }
          >
            Create Quiz
          </NavLink>
          {user ? (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `hover:text-fuchsia-300 transition text-lg font-medium ${
                  isActive ? "text-fuchsia-400" : "text-gray-200"
                }`
              }
            >
              Dashboard
            </NavLink>
          ) : (
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                `hover:text-fuchsia-300 transition text-lg font-medium ${
                  isActive ? "text-fuchsia-400" : "text-gray-200"
                }`
              }
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {user ? (
            // small avatar + name hidden on mobile menu (we'll show actions inside mobile menu)
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
          ) : null}

          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="p-2 rounded-md text-gray-200 hover:text-fuchsia-300 focus:outline-none"
          >
            {/* simple svg hamburger / x */}
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Right Section (Desktop) — preserved behavior */}
        {user ? (
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 bg-gray-800 px-2 rounded-full hover:bg-gray-700 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-gray-200 font-medium text-lg">
                {user.name || "User"}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700">
                <button className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-fuchsia-400">
                  My Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-fuchsia-400"
                  onClick={handleSignOut}
                >
                  SignOut
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth/register" className="hidden md:inline-block">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-gray-900 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition duration-300">
              SignUp
            </span>
          </Link>
        )}
      </div>

      {/* Mobile Menu — only visibility/position added; SAME links/actions as desktop */}
      {isMobileMenuOpen && (
        <div
          ref={mobileRef}
          className="md:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="flex flex-col px-4 py-4 space-y-2">
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `py-2 px-3 rounded text-lg font-medium ${
                  isActive ? "text-fuchsia-400" : "text-gray-200"
                } hover:text-fuchsia-300`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `py-2 px-3 rounded text-lg font-medium ${
                  isActive ? "text-fuchsia-400" : "text-gray-200"
                } hover:text-fuchsia-300`
              }
            >
              Create Quiz
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-2 px-3 rounded text-lg font-medium ${
                      isActive ? "text-fuchsia-400" : "text-gray-200"
                    } hover:text-fuchsia-300`
                  }
                >
                  Dashboard
                </NavLink>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="text-left py-2 px-3 rounded text-gray-200 hover:text-fuchsia-300"
                >
                  My Profile
                </button>

                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded text-gray-200 hover:text-fuchsia-300"
                >
                  SignOut
                </button>

                <button
                  onClick={handleLogout}
                  className="text-left py-2 px-3 rounded text-red-400 hover:text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 px-3 rounded text-lg font-medium text-gray-200 hover:text-fuchsia-300"
                >
                  Login
                </NavLink>
                <Link
                  to="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-block"
                >
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-gray-900 rounded-lg font-bold">
                    SignUp
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
