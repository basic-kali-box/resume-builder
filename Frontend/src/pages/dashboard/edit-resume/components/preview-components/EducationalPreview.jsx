import React from "react";

// Utility function to convert markdown bold to HTML
const convertMarkdownToHTML = (text) => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

function EducationalPreview({ resumeInfo }) {
  return (
    <div className="my-6">
      {resumeInfo?.education.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-2"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            Education
          </h2>
          <hr
            style={{
              borderColor: resumeInfo?.themeColor,
            }}
          />
        </div>
      )}

      {resumeInfo?.education.map((education, index) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {education.universityName}
          </h2>
          <h2 className="text-xs flex justify-between">
            {education?.degree}
            {education?.degree && education?.major ? " in " : null}
            {education?.major}
            <span>
              {education?.startDate}{" "}
              {education?.startDate && education?.endDate ? " - " : null}{" "}
              {education?.endDate}
            </span>
          </h2>
          <div className="text-xs">
            {education?.grade ? `${education?.gradeType} - ${education?.grade}` : null}
          </div>
          <div
            className="text-xs my-2"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(education?.description) }}
          />
        </div>
      ))}
    </div>
  );
}

export default EducationalPreview;
