import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllResumeData, getResumeData } from "@/Services/resumeAPI";
import { addResumeData } from "@/features/resume/resumeFeatures";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import DashboardResumePreview from "./components/DashboardResumePreview";

import DashboardStats from "./components/DashboardStats";
import TrialCounter from "@/components/custom/TrialCounter";
import { useTrial } from "@/context/TrialContext";
import { FaCrown } from "react-icons/fa";
import TrialWarningPopup from "@/components/custom/TrialWarningPopup";
import { useTrialWarning } from "@/hooks/useTrialWarning";
import { LoadingSpinner, SkeletonCard } from "@/components/ui/loading-states";
import { enhancedToast } from "@/components/ui/enhanced-toast";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trialStatus } = useTrial();
  const { isWarningOpen, checkTrialsAndWarn, closeWarning, showWarning } = useTrialWarning();
  const [resumeList, setResumeList] = React.useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllResumeData = async () => {
    try {
      setIsLoadingResumes(true);
      setError(null);

      const resumes = await getAllResumeData();
      console.log(
        `Printing from DashBoard List of Resumes got from Backend`,
        resumes.data
      );
      setResumeList(resumes.data);

      // Auto-select the first resume for preview if none selected
      if (resumes.data.length > 0 && !selectedResumeId) {
        setSelectedResumeId(resumes.data[0]._id);
        await loadResumePreview(resumes.data[0]._id);
      }

      if (resumes.data.length === 0) {
        setTimeout(() => {
          enhancedToast("Welcome to your Resume Dashboard! 🎉", "info", {
            description: "Ready to create your first professional resume? Let's get started!"
          });
        }, 1000);
      }
    } catch (error) {
      console.log("Error from dashboard", error.message);
      setError(error.message);
      enhancedToast("Failed to load resumes", "error", {
        description: "Please refresh the page or try again later"
      });
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const loadResumePreview = async (resumeId) => {
    if (!resumeId) return;

    setIsLoadingPreview(true);
    try {
      const resumeData = await getResumeData(resumeId);
      dispatch(addResumeData(resumeData.data));
    } catch (error) {
      console.log("Error loading resume preview", error.message);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleResumeSelect = async (resumeId) => {
    setSelectedResumeId(resumeId);
    await loadResumePreview(resumeId);
  };

  useEffect(() => {
    fetchAllResumeData();
  }, [user]);

  // Automatic trial exhaustion detection
  useEffect(() => {
    // Check if trial status is loaded and trials are exhausted
    if (trialStatus && trialStatus.remainingTrials === 0) {
      // Show the trial warning modal automatically
      showWarning();
    }
  }, [trialStatus, showWarning]);

  return (
    <div className="min-h-screen dashboard-gradient-bg flex flex-col">
      {/* Main Content */}
      <main className="flex-1" role="main">
        <div className="mobile-padding py-8 md:py-12">
          <div className="mobile-container" id="dashboard-description">
            {/* Header Section */}
            <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
              <div className="mb-6">
                <h1
                  className="font-bold mobile-heading bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-scale-in"
                  role="heading"
                  aria-level="1"
                >
                  My Resume Dashboard
                </h1>
                <p
                  className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mobile-padding mb-8 animate-fade-in-up animate-stagger-1"
                  role="text"
                  aria-describedby="dashboard-description"
                >
                  Create, manage, and preview your AI-powered resumes with professional precision
                </p>
              </div>

              {/* Premium CTA */}
              {trialStatus.remainingTrials > 0 && (
                <div className="flex justify-center animate-fade-in-up animate-stagger-2">
                  <button
                    onClick={() => navigate('/pricing')}
                    className="btn-modern-primary group relative overflow-hidden focus:ring-4 focus:ring-blue-300"
                    aria-label="Upgrade to Premium for unlimited AI features"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-2">
                      <FaCrown className="h-5 w-5 animate-float" aria-hidden="true" />
                      Upgrade to Premium
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        Unlimited AI
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard Stats */}
            <div className="animate-fade-in-up animate-stagger-3">
              <DashboardStats resumeList={resumeList} />
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid animate-fade-in-up animate-stagger-4">
              {/* Sidebar - Resume Management */}
              <div className="dashboard-sidebar">
                {/* Trial Counter */}
                <div className="animate-slide-in-left">
                  <TrialCounter className="mb-6" />
                </div>

                {/* Resume Management Card */}
                <div className="dashboard-card animate-slide-in-left animate-stagger-1">
                  <div className="dashboard-section-title">
                    <div className="icon-container bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Your Resumes
                  </div>

                  <div className="space-y-4">
                    <AddResume />

                    {/* Enhanced Loading State */}
                    {isLoadingResumes && (
                      <div className="space-y-4" role="status" aria-label="Loading resumes">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="dashboard-card-compact animate-pulse">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                              <div className="h-8 bg-gray-200 rounded flex-1"></div>
                              <div className="h-8 bg-gray-200 rounded flex-1"></div>
                              <div className="h-8 bg-gray-200 rounded flex-1"></div>
                            </div>
                          </div>
                        ))}
                        <span className="sr-only">Loading your resumes...</span>
                      </div>
                    )}

                    {/* Error State */}
                    {error && !isLoadingResumes && (
                      <div className="text-center py-8 dashboard-card-compact border-red-200 bg-red-50">
                        <div className="icon-container-sm bg-red-100 text-red-500 mx-auto mb-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-red-600 font-medium mb-2">Failed to load resumes</div>
                        <button
                          onClick={fetchAllResumeData}
                          className="btn-modern-secondary text-sm"
                        >
                          Try again
                        </button>
                      </div>
                    )}

                    {/* Resume List */}
                    {!isLoadingResumes && !error && resumeList.length > 0 && (
                      <div className="space-y-4">
                        {resumeList.map((resume, index) => (
                          <div
                            key={resume._id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <ResumeCard
                              resume={resume}
                              refreshData={fetchAllResumeData}
                              onSelect={handleResumeSelect}
                              isSelected={selectedResumeId === resume._id}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Enhanced Empty State */}
                    {!isLoadingResumes && !error && resumeList.length === 0 && (
                      <div className="text-center py-12 dashboard-card-compact border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50 animate-fade-in-up">
                        <div className="icon-container-lg bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 mx-auto mb-6 animate-float">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-3">Welcome to Your Resume Dashboard!</h3>
                        <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
                          Ready to create your first professional resume? Let's build something amazing together!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            AI-Powered
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            ATS-Friendly
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Professional
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content - Resume Preview */}
              <div className="dashboard-main">
                <div className="dashboard-card animate-slide-in-right">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div className="dashboard-section-title mb-0">
                      <div className="icon-container bg-gradient-to-br from-green-500 to-teal-600 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      Resume Preview
                    </div>

                    {selectedResumeId && (
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => navigate(`/dashboard/edit-resume/${selectedResumeId}`)}
                          className="btn-modern-secondary group flex-1 sm:flex-none"
                        >
                          <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Resume
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/view-resume/${selectedResumeId}`)}
                          className="btn-modern-primary group flex-1 sm:flex-none"
                        >
                          <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Full
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="h-64 sm:h-96 lg:h-[700px] rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                    <DashboardResumePreview
                      isLoading={isLoadingPreview}
                      hasResumes={resumeList.length > 0}
                    />
                  </div>
                </div>

                {/* Quick Actions Card */}
                {resumeList.length > 0 && (
                  <div className="dashboard-card animate-slide-in-right animate-stagger-1">
                    <div className="dashboard-section-title">
                      <div className="icon-container bg-gradient-to-br from-orange-500 to-red-600 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      Quick Actions
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <button
                        onClick={() => document.querySelector('[data-create-resume]')?.click()}
                        className="dashboard-card-compact hover:bg-blue-50 hover:border-blue-200 text-left group focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Create a new resume"
                      >
                        <div className="icon-container-sm bg-blue-100 text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">New Resume</h4>
                        <p className="text-sm text-gray-600">Start from scratch</p>
                      </button>

                      <button
                        onClick={() => window.open('https://docs.google.com/document/d/1example', '_blank')}
                        className="dashboard-card-compact hover:bg-green-50 hover:border-green-200 text-left group focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        aria-label="View resume tips and guides"
                      >
                        <div className="icon-container-sm bg-green-100 text-green-600 mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">Resume Tips</h4>
                        <p className="text-sm text-gray-600">Expert guidance</p>
                      </button>

                      <button
                        onClick={() => navigate('/pricing')}
                        className="dashboard-card-compact hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 text-left group focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Upgrade to Premium for unlimited features"
                      >
                        <div className="icon-container-sm bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                          <FaCrown className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">Go Premium</h4>
                        <p className="text-sm text-gray-600">Unlimited features</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trial Warning Popup */}
      <TrialWarningPopup
        isOpen={isWarningOpen}
        onClose={closeWarning}
      />
    </div>
  );
}

export default Dashboard;
