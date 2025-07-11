import React from "react";

// Utility function to convert markdown bold to HTML
const convertMarkdownToHTML = (text) => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

function ProjectPreview({ resumeInfo }) {
  return (
    <div className="my-6">
      {resumeInfo?.projects.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-2"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            Personal Project
          </h2>
          <hr
            style={{
              borderColor: resumeInfo?.themeColor,
            }}
          />
        </div>
      )}

      {resumeInfo?.projects?.map((project, index) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {project?.projectName}
          </h2>
          <h2 className="text-xs flex justify-between">
            {project?.techStack?.length > 0 && (
              <span>Tech Stack: {project?.techStack?.split(",").join(" | ")}</span>
            )}
          </h2>
          <div
            className="text-xs my-2"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(project?.projectSummary) }}
          />
        </div>
      ))}
    </div>
  );
}

export default ProjectPreview;
