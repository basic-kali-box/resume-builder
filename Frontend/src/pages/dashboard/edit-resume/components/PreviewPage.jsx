import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";
import { toast } from "sonner";
import { generateResumePDF, validateResumeForPDF } from "@/utils/pdfGenerator";
import PersonalDeatailPreview from "./preview-components/PersonalDeatailPreview";
import SummeryPreview from "./preview-components/SummaryPreview";
import ExperiencePreview from "./preview-components/ExperiencePreview";
import EducationalPreview from "./preview-components/EducationalPreview";
import SkillsPreview from "./preview-components/SkillsPreview";
import ProjectPreview from "./preview-components/ProjectPreview";
import CertificationsPreview from "./preview-components/CertificationsPreview";


function PreviewPage() {
  const resumeData = useSelector((state) => state.editResume.resumeData);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    console.log("PreviewPage rendered ");
  }, [resumeData]);

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);

      // Validate resume data
      validateResumeForPDF(resumeData);

      // Generate and download PDF
      const result = await generateResumePDF(resumeData, 'resume-preview');

      toast.success(result.message + ` as ${result.filename}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(error.message || 'Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="relative">
      {/* PDF Download Button */}
      <div className="mb-4 flex justify-end">
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2"
        >
          {isGeneratingPDF ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>

      {/* Resume Preview */}
      <div
        id="resume-preview"
        className={`mobile-resume-preview shadow-lg bg-white border-t-[20px] min-h-[297mm]`}
        style={{
          borderColor: resumeData?.themeColor ? resumeData.themeColor : "#000000",
          padding: "40px 32px", // Responsive padding: smaller on mobile
          lineHeight: "1.5",
          fontSize: "14px",
        }}
      >
        {/* Personal Details Section */}
        <div className="mb-6">
          <PersonalDeatailPreview resumeInfo={resumeData} />
        </div>

        {/* Summary Section */}
        {resumeData?.summary && (
          <div className="mb-6">
            <SummeryPreview resumeInfo={resumeData} />
          </div>
        )}

        {/* Experience Section */}
        {resumeData?.experience && resumeData.experience.length > 0 && (
          <div className="mb-6 break-inside-avoid">
            <ExperiencePreview resumeInfo={resumeData} />
          </div>
        )}

        {/* Projects Section */}
        {resumeData?.projects && resumeData.projects.length > 0 && (
          <div className="mb-6 break-inside-avoid">
            <ProjectPreview resumeInfo={resumeData} />
          </div>
        )}

        {/* Education Section */}
        {resumeData?.education && resumeData.education.length > 0 && (
          <div className="mb-6 break-inside-avoid">
            <EducationalPreview resumeInfo={resumeData} />
          </div>
        )}

        {/* Conditional Sections: Only show if data exists */}

        {/* Certifications Section - Only show if data exists */}
        {resumeData?.certifications && resumeData.certifications.length > 0 &&
         resumeData.certifications.some(cert => cert.name && cert.name.trim() !== '') && (
          <div className="mb-6 break-inside-avoid">
            <CertificationsPreview resumeInfo={resumeData} />
          </div>
        )}

        {/* Skills Section - Only show if data exists */}
        {resumeData?.skills && resumeData.skills.length > 0 &&
         resumeData.skills.some(skill => skill.name && skill.name.trim() !== '') && (
          <div className="mb-6 break-inside-avoid">
            <SkillsPreview resumeInfo={resumeData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewPage;
