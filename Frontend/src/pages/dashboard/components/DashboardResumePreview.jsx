import React from "react";
import { useSelector } from "react-redux";
import { FaSpinner, FaFileAlt, FaPlus } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import PersonalDeatailPreview from "../edit-resume/components/preview-components/PersonalDeatailPreview";
import SummeryPreview from "../edit-resume/components/preview-components/SummaryPreview";
import ExperiencePreview from "../edit-resume/components/preview-components/ExperiencePreview";
import EducationalPreview from "../edit-resume/components/preview-components/EducationalPreview";
import SkillsPreview from "../edit-resume/components/preview-components/SkillsPreview";
import ProjectPreview from "../edit-resume/components/preview-components/ProjectPreview";

function DashboardResumePreview({ isLoading, hasResumes }) {
  const resumeData = useSelector((state) => state.editResume.resumeData);

  // Add animation when resume data changes
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (resumeData) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [resumeData]);

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 p-4">
        <div className="relative w-full max-w-2xl">
          <div
            className="relative w-full bg-white shadow-2xl rounded-lg overflow-hidden"
            style={{ aspectRatio: '210/297' }}
          >
            <div className="absolute -inset-1 bg-gray-300 rounded-lg -z-10 transform translate-x-1 translate-y-1"></div>
            <div className="h-full p-6 space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-px w-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <FaSpinner className="animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No resumes state
  if (!hasResumes) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <FaPlus className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Resumes Yet</h3>
          <p className="text-gray-500 mb-4">Create your first resume to see the preview here</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Create New Resume
          </button>
        </div>
      </div>
    );
  }

  // No resume selected state
  if (!resumeData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <FaFileAlt className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Resume</h3>
          <p className="text-gray-500">Choose a resume from the left panel to preview it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 p-4">
      {/* A4 Paper Container with proper aspect ratio */}
      <div className="relative w-full max-w-2xl">
        {/* A4 aspect ratio container (210:297 = 1:1.414) */}
        <div
          className={`relative w-full bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300 ${
            isAnimating ? 'scale-[1.02] shadow-3xl' : 'scale-100'
          }`}
          style={{
            aspectRatio: '210/297', // A4 aspect ratio
            maxHeight: '70vh' // Limit height to viewport
          }}
        >
          {/* Paper shadow effect */}
          <div className="absolute -inset-1 bg-gray-300 rounded-lg -z-10 transform translate-x-1 translate-y-1"></div>

          {/* Resume content with proper scaling */}
          <div
            className="h-full overflow-hidden relative"
            style={{
              borderTopWidth: "6px",
              borderTopColor: resumeData?.themeColor || "#000000",
            }}
          >
            {/* Scrollable content area */}
            <div className="h-full overflow-y-auto p-6 text-xs leading-tight">
              {/* Personal Details */}
              <PersonalDeatailPreview resumeInfo={resumeData} />

              {/* Summary */}
              {resumeData?.summary && (
                <div className="mb-3">
                  <SummeryPreview resumeInfo={resumeData} />
                </div>
              )}

              {/* Experience */}
              {resumeData?.experience && resumeData.experience.length > 0 && (
                <div className="mb-3">
                  <ExperiencePreview resumeInfo={resumeData} />
                </div>
              )}

              {/* Projects */}
              {resumeData?.projects && resumeData.projects.length > 0 && (
                <div className="mb-3">
                  <ProjectPreview resumeInfo={resumeData} />
                </div>
              )}

              {/* Education */}
              {resumeData?.education && resumeData.education.length > 0 && (
                <div className="mb-3">
                  <EducationalPreview resumeInfo={resumeData} />
                </div>
              )}

              {/* Skills */}
              {resumeData?.skills && resumeData.skills.length > 0 && (
                <div className="mb-3">
                  <SkillsPreview resumeInfo={resumeData} />
                </div>
              )}
            </div>

            {/* A4 Paper indicator */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow">
              A4 Preview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardResumePreview;
