import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaUser, FaSignOutAlt, FaCog, FaBell, FaSearch, FaPlus, FaHome, FaBars, FaTimes } from "react-icons/fa";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { TrialCounterMini } from "./TrialCounter";

function Header({user}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Check if we're on the dashboard page
  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    if(user){
      console.log("Printing From Header User Found");
    }
    else{
      console.log("Printing From Header User Not Found");
    }
  }, []);

  // Handle escape key press to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode == 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCreateResume = () => {
    // This will trigger the AddResume dialog
    document.querySelector('[data-create-resume]')?.click();
    closeMobileMenu();
  };

  const handleHomeNavigation = () => {
    navigate("/");
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="mobile-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AR</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">AI Resume Builder</h1>
                <p className="text-xs text-gray-500">Professional Resume Creator</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">AI Resume</h1>
              </div>
            </div>
          </div>

          {/* Dashboard Search Bar - Only show on dashboard */}
          {isDashboard && user && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search resumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              ref={hamburgerRef}
              variant="outline"
              size="sm"
              onClick={toggleMobileMenu}
              className="btn-touch relative z-50 transition-all duration-300 hover:bg-gray-100"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <FaBars
                  className={`h-4 w-4 absolute transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`}
                />
                <FaTimes
                  className={`h-4 w-4 absolute transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                  }`}
                />
              </div>
            </Button>
          </div>

          {/* Desktop Navigation Actions */}
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              {/* Dashboard-specific actions */}
              {isDashboard ? (
                <>
                  {/* Home Button */}
                  <Button
                    variant="outline"
                    onClick={handleHomeNavigation}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center space-x-2 btn-touch"
                  >
                    <FaHome className="h-4 w-4" />
                    <span className="hidden lg:inline">Home</span>
                  </Button>

                  {/* Create Resume Button */}
                  <Button
                    onClick={handleCreateResume}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium btn-touch"
                  >
                    <FaPlus className="h-4 w-4" />
                    <span className="hidden lg:inline">New Resume</span>
                  </Button>

                  {/* Trial Counter */}
                  <TrialCounterMini className="hidden lg:flex" />

                  {/* Notifications */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors btn-touch">
                    <FaBell className="h-5 w-5" />
                  </button>

                  {/* Enhanced User Menu for Dashboard */}
                  <div className="relative">
                    <button
                      className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors btn-touch"
                      onClick={handleLogout}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.fullName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <FaSignOutAlt className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </>
              ) : (
                /* Non-dashboard actions */
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 btn-touch"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 btn-touch"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:block">
              <Link to="/auth/sign-in">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium btn-touch">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <div
            ref={mobileMenuRef}
            className={`absolute top-16 left-0 right-0 bg-white shadow-xl border-t border-gray-200 transform transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? 'translate-y-0 opacity-100'
                : '-translate-y-full opacity-0'
            }`}
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
          >
            <div className="px-4 py-6 space-y-4 overflow-y-auto max-h-full">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-lg">
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900">
                        {user?.fullName || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Search Bar - Mobile */}
                  {isDashboard && (
                    <div className="pb-4 border-b border-gray-200">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search resumes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Items */}
                  <div className="space-y-3">
                    {isDashboard ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleHomeNavigation}
                          className="w-full justify-start h-12 text-base border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                        >
                          <FaHome className="h-5 w-5 mr-3" />
                          Home
                        </Button>
                        <Button
                          onClick={handleCreateResume}
                          className="w-full justify-start h-12 text-base bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <FaPlus className="h-5 w-5 mr-3" />
                          New Resume
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleLogout();
                            closeMobileMenu();
                          }}
                          className="w-full justify-start h-12 text-base border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                        >
                          <FaSignOutAlt className="h-5 w-5 mr-3" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigate("/dashboard");
                            closeMobileMenu();
                          }}
                          className="w-full justify-start h-12 text-base border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                        >
                          <FaUser className="h-5 w-5 mr-3" />
                          Dashboard
                        </Button>
                        <Button
                          onClick={() => {
                            handleLogout();
                            closeMobileMenu();
                          }}
                          className="w-full justify-start h-12 text-base bg-red-600 hover:bg-red-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <FaSignOutAlt className="h-5 w-5 mr-3" />
                          Logout
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Trial Counter - Mobile */}
                  {isDashboard && (
                    <div className="pt-4 border-t border-gray-200">
                      <TrialCounterMini className="w-full" />
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <Link to="/auth/sign-in" onClick={closeMobileMenu}>
                    <Button className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl">
                      Get Started
                    </Button>
                  </Link>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Create professional resumes with AI
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
