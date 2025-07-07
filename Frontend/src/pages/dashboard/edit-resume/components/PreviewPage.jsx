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
import EducationTrainingPreview from "./preview-components/EducationTrainingPreview";

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
        className={`shadow-lg bg-white border-t-[20px] min-h-[297mm] max-w-[210mm] mx-auto`}
        style={{
          borderColor: resumeData?.themeColor ? resumeData.themeColor : "#000000",
          padding: "56px", // 20mm margins converted to pixels (20mm * 96dpi / 25.4)
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

        {/* Three-Column Section: Certifications, Education/Training, Skills */}
        <div className="grid grid-cols-3 gap-6 mt-6 break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
          {/* Left Column: Certifications */}
          <div className="break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
            {resumeData?.certifications && resumeData.certifications.length > 0 ? (
              <CertificationsPreview resumeInfo={resumeData} />
            ) : (
              <div className="my-6">
                <h2
                  className="text-center font-bold text-sm mb-2"
                  style={{ color: resumeData?.themeColor }}
                >
                  CERTIFICATIONS
                </h2>
                <hr style={{ borderColor: resumeData?.themeColor }} />
                <p className="text-xs text-gray-500 text-center mt-2">No certifications added</p>
              </div>
            )}
          </div>

          {/* Middle Column: Education/Training */}
          <div className="break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
            {resumeData?.educationTraining && resumeData.educationTraining.length > 0 ? (
              <EducationTrainingPreview resumeInfo={resumeData} />
            ) : (
              <div className="my-6">
                <h2
                  className="text-center font-bold text-sm mb-2"
                  style={{ color: resumeData?.themeColor }}
                >
                  EDUCATION & TRAINING
                </h2>
                <hr style={{ borderColor: resumeData?.themeColor }} />
                <p className="text-xs text-gray-500 text-center mt-2">No training added</p>
              </div>
            )}
          </div>

          {/* Right Column: Skills */}
          <div className="break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
            {resumeData?.skills && resumeData.skills.length > 0 ? (
              <SkillsPreview resumeInfo={resumeData} />
            ) : (
              <div className="my-6">
                <h2
                  className="text-center font-bold text-sm mb-2"
                  style={{ color: resumeData?.themeColor }}
                >
                  SKILLS
                </h2>
                <hr style={{ borderColor: resumeData?.themeColor }} />
                <p className="text-xs text-gray-500 text-center mt-2">No skills added</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;
