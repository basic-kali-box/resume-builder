import React, { useEffect, useState } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "@/Services/resumeAPI";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isExtractedResume, setIsExtractedResume] = useState(false);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        setIsLoading(true);
        const response = await getResumeData(resume_id);
        const resumeData = response.data;

        dispatch(addResumeData(resumeData));

        // Check if this resume has extracted data (non-empty fields indicate extraction)
        const hasExtractedData = resumeData.summary ||
          (resumeData.experience && resumeData.experience.length > 0 && resumeData.experience[0].title) ||
          (resumeData.education && resumeData.education.length > 0 && resumeData.education[0].universityName) ||
          (resumeData.skills && resumeData.skills.length > 0) ||
          (resumeData.projects && resumeData.projects.length > 0 && resumeData.projects[0].projectName);

        setIsExtractedResume(hasExtractedData);

        if (hasExtractedData) {
          toast.success("Resume data loaded from uploaded file. You can now review and enhance the extracted information!");
        }
      } catch (error) {
        console.error("Error loading resume data:", error);
        toast.error("Failed to load resume data");
      } finally {
        setIsLoading(false);
      }
    };

    if (resume_id) {
      loadResumeData();
    }
  }, [resume_id, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-edit-layout mobile-padding py-6 lg:py-10 gap-6 lg:gap-10">
      {isExtractedResume && (
        <div className="xl:col-span-2 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Resume data extracted successfully!
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Your resume has been automatically populated with extracted information.
                  Review each section and use the AI enhancement features to improve your content.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="order-1 xl:order-1">
        <ResumeForm />
      </div>
      <div className="order-2 xl:order-2">
        <PreviewPage />
      </div>
    </div>
  );
}

export default EditResume;
