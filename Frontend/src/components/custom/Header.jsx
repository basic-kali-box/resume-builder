import React, { useEffect, useState } from "react";
import logo from "/logo.svg";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaUser, FaSignOutAlt, FaCog, FaBell, FaSearch, FaPlus, FaHome } from "react-icons/fa";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";

function Header({user}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

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
  };

  const handleHomeNavigation = () => {
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AR</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Resume Builder</h1>
                <p className="text-xs text-gray-500">Professional Resume Creator</p>
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

          {/* Navigation Actions */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Dashboard-specific actions */}
              {isDashboard ? (
                <>
                  {/* Home Button */}
                  <Button
                    variant="outline"
                    onClick={handleHomeNavigation}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center space-x-2"
                  >
                    <FaHome className="h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>

                  {/* Create Resume Button */}
                  <Button
                    onClick={handleCreateResume}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium"
                  >
                    <FaPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Resume</span>
                  </Button>

                  {/* Notifications */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaBell className="h-5 w-5" />
                  </button>

                  {/* Enhanced User Menu for Dashboard */}
                  <div className="relative">
                    <button
                      className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={handleLogout}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="hidden md:block text-left">
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
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Link to="/auth/sign-in">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
