import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllResumeData, getResumeData } from "@/Services/resumeAPI";
import { addResumeData } from "@/features/resume/resumeFeatures";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import DashboardResumePreview from "./components/DashboardResumePreview";
import DashboardFooter from "./components/DashboardFooter";
import DashboardStats from "./components/DashboardStats";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();
  const [resumeList, setResumeList] = React.useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const fetchAllResumeData = async () => {
    try {
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
    } catch (error) {
      console.log("Error from dashboard", error.message);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <div className="p-6 md:p-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-bold text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                My Resume Dashboard
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create, manage, and preview your AI-powered resumes all in one place
              </p>
            </div>

            {/* Dashboard Stats */}
            <DashboardStats resumeList={resumeList} />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Side - Resume Cards */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">Your Resumes</h3>
                  <div className="space-y-4">
                    <AddResume />
                    {resumeList.length > 0 &&
                      resumeList.map((resume) => (
                        <ResumeCard
                          key={resume._id}
                          resume={resume}
                          refreshData={fetchAllResumeData}
                          onSelect={handleResumeSelect}
                          isSelected={selectedResumeId === resume._id}
                        />
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Resume Preview */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-xl text-gray-800">Live Preview</h3>
                    {selectedResumeId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`/dashboard/edit-resume/${selectedResumeId}`, '_blank')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit Resume
                        </button>
                        <button
                          onClick={() => window.open(`/dashboard/view-resume/${selectedResumeId}`, '_blank')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          View Full
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="h-96 lg:h-[600px]">
                    <DashboardResumePreview
                      isLoading={isLoadingPreview}
                      hasResumes={resumeList.length > 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

export default Dashboard;
