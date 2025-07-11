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
import CertificationsPreview from "../edit-resume/components/preview-components/CertificationsPreview";

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
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center animate-fade-in-up">
          <div className="icon-container-lg bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 mx-auto mb-6 animate-float">
            <FaPlus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">No Resumes Yet</h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Create your first resume to see a beautiful preview here
          </p>
          <div className="space-y-2">
            <div className="w-32 h-2 bg-gray-200 rounded mx-auto"></div>
            <div className="w-24 h-2 bg-gray-200 rounded mx-auto"></div>
            <div className="w-28 h-2 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // No resume selected state
  if (!resumeData) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center animate-fade-in-up">
          <div className="icon-container-lg bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 mx-auto mb-6 animate-float">
            <FaFileAlt className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Select a Resume</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Choose a resume from your collection to preview it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl">
      {/* A4 Paper Container with proper aspect ratio */}
      <div className="relative w-full max-w-2xl animate-fade-in-up">
        {/* A4 aspect ratio container (210:297 = 1:1.414) */}
        <div
          className={`relative w-full bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-500 hover:shadow-3xl group ${
            isAnimating ? 'scale-[1.02] shadow-3xl animate-glow' : 'scale-100'
          }`}
          style={{
            aspectRatio: '210/297', // A4 aspect ratio
            maxHeight: '75vh' // Limit height to viewport
          }}
        >
          {/* Enhanced paper shadow effect */}
          <div className="absolute -inset-2 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl -z-10 transform translate-x-2 translate-y-2 opacity-60"></div>
          <div className="absolute -inset-1 bg-gray-200 rounded-xl -z-10 transform translate-x-1 translate-y-1 opacity-80"></div>

          {/* Resume content with proper scaling */}
          <div
            className="h-full overflow-hidden relative"
            style={{
              borderTopWidth: "8px",
              borderTopColor: resumeData?.themeColor || "#000000",
            }}
          >
            {/* Scrollable content area */}
            <div className="h-full overflow-y-auto p-6 text-xs leading-tight custom-scrollbar">
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

              {/* Certifications - Only show if data exists */}
              {resumeData?.certifications && resumeData.certifications.length > 0 &&
               resumeData.certifications.some(cert => cert.name && cert.name.trim() !== '') && (
                <div className="mb-3">
                  <CertificationsPreview resumeInfo={resumeData} />
                </div>
              )}

              {/* Skills - Only show if data exists */}
              {resumeData?.skills && resumeData.skills.length > 0 &&
               resumeData.skills.some(skill => skill.name && skill.name.trim() !== '') && (
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
