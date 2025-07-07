import React from "react";

function EducationTrainingPreview({ resumeInfo }) {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        EDUCATION & TRAINING
      </h2>
      <hr
        style={{
          borderColor: resumeInfo?.themeColor,
        }}
      />

      {resumeInfo?.educationTraining?.map((training, index) => (
        <div key={index} className="my-3">
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {training?.courseName}
          </h2>
          <h2 className="text-xs text-gray-600">
            {training?.institution}
          </h2>
          <div className="text-xs text-gray-500 mb-1">
            Completed: {training?.completionDate ? 
              new Date(training.completionDate + '-01').toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
              }) : 'N/A'
            }
          </div>
          {training?.description && (
            <p className="text-xs text-gray-700 mt-1">
              {training.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default EducationTrainingPreview;
