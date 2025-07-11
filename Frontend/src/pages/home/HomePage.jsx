import Header from "@/components/custom/Header";
import React, { useEffect } from "react";
import heroSnapshot from "@/assets/heroSnapshot.png";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaCircle, FaInfoCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { startUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";

function HomePage() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    window.open(
      "https://github.com/basic-kali-box/resume-builder",
      "_blank"
    );
  };

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode == 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
        }
      } catch (error) {
        console.log(
          "Printing from Home Page there was a error ->",
          error.message
        );
        dispatch(addUserData(""));
      }
    };
    fetchResponse();
  }, []);

  const hadnleGetStartedClick = () => {
    if (user) {
      console.log("Printing from Homepage User is There ");
      navigate("/dashboard");
    } else {
      console.log("Printing for Homepage User Not Found");
      navigate("/auth/sign-in");
    }
  };
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} />

      {/* Hero Section */}
      <section className="pt-8 sm:pt-16 pb-12 sm:pb-20">
        <div className="mobile-container">
          <div className="text-center">
            <h1 className="mb-6 sm:mb-8 mobile-heading font-extrabold leading-tight tracking-normal text-gray-900">
              <span>Start</span>{" "}
              <span className="block w-full py-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 sm:inline">
                building a Resume
              </span>{" "}
              <span className="block sm:inline">for your next Job</span>
            </h1>
            <p className="max-w-3xl mx-auto mb-8 sm:mb-12 text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed mobile-padding">
              Build. Refine. Shine. With AI-Driven Resumes that get you noticed by employers
            </p>
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16 mobile-padding">
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group btn-touch"
                onClick={hadnleGetStartedClick}
              >
                Get Started Free
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <button
                onClick={handleClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 group btn-touch"
              >
                <FaGithub className="w-5 h-5 mr-2" />
                View on GitHub
                <svg
                  className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </button>
            </div>
            {/* Features Preview */}
            <div className="mobile-grid gap-6 sm:gap-8 mb-12 sm:mb-16">
              <div className="mobile-card bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-sm sm:text-base text-gray-600">Enhance your content with intelligent AI suggestions and improvements</p>
              </div>

              <div className="mobile-card bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Professional Templates</h3>
                <p className="text-sm sm:text-base text-gray-600">Choose from modern, ATS-friendly resume templates</p>
              </div>

              <div className="mobile-card bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-sm sm:text-base text-gray-600">Your data is protected with enterprise-grade security</p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="w-full mx-auto text-center mobile-padding">
            <div className="relative z-0 w-full max-w-4xl mx-auto">
              <div className="relative overflow-hidden shadow-2xl rounded-xl bg-white">
                <div className="flex items-center justify-between px-3 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 h-12 sm:h-14">
                  <div className="flex space-x-2">
                    <FaCircle className="w-2 sm:w-3 h-2 sm:h-3 text-white/70 hover:text-white transition duration-300 transform hover:scale-125" />
                    <FaCircle className="w-2 sm:w-3 h-2 sm:h-3 text-white/70 hover:text-white transition duration-300 transform hover:scale-125" />
                    <FaCircle className="w-2 sm:w-3 h-2 sm:h-3 text-white/70 hover:text-white transition duration-300 transform hover:scale-125" />
                  </div>
                  <div className="text-white font-medium text-xs sm:text-sm">AI Resume Builder Dashboard</div>
                  <FaInfoCircle className="text-white/70 hover:text-white transition duration-300 transform hover:rotate-12 w-3 sm:w-4 h-3 sm:h-4" />
                </div>
                <div className="p-2 sm:p-4 bg-gray-50">
                  <img
                    className="w-full object-cover rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02]"
                    src={heroSnapshot}
                    alt="AI Resume Builder Dashboard Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="mobile-container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="mobile-subheading font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mobile-padding">
              Create your professional resume in just three simple steps
            </p>
          </div>

          <div className="mobile-grid gap-6 sm:gap-8">
            <div className="text-center mobile-card">
              <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white font-bold text-lg sm:text-xl">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Add Your Information</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Fill in your personal details, work experience, education, and skills using our intuitive forms
              </p>
            </div>

            <div className="text-center mobile-card">
              <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white font-bold text-lg sm:text-xl">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">AI Enhancement</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Let our AI enhance your content with professional language and industry-specific improvements
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Download & Apply</h3>
              <p className="text-gray-600">
                Download your polished resume in PDF format and start applying to your dream jobs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers who have successfully landed their dream jobs with our AI-powered resume builder
          </p>
          <button
            onClick={hadnleGetStartedClick}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
          >
            Start Building Now - It's Free
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AR</span>
                </div>
                <span className="text-lg font-bold text-gray-900">AI Resume Builder</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 max-w-md">
                Create professional, ATS-friendly resumes with the power of AI.
                Build your career with confidence using our intelligent resume builder.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleClick}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaGithub className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Examples
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    AI Features
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm flex items-center mt-2 md:mt-0">
                Made with ❤️ for job seekers worldwide
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
