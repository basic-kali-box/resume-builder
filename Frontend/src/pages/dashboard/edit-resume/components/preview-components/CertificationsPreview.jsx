import React from "react";

function CertificationsPreview({ resumeInfo }) {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        CERTIFICATIONS
      </h2>
      <hr
        style={{
          borderColor: resumeInfo?.themeColor,
        }}
      />

      {resumeInfo?.certifications?.map((certification, index) => (
        <div key={index} className="my-3">
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {certification?.name}
          </h2>
          <h2 className="text-xs text-gray-600">
            {certification?.issuingOrganization}
          </h2>
          {(certification?.issueDate || certification?.expirationDate) && (
            <div className="text-xs text-gray-500 flex justify-between">
              {certification?.issueDate && (
                <span>
                  Issued: {new Date(certification.issueDate + '-01').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short'
                  })}
                </span>
              )}
              {certification?.expirationDate && (
                <span>
                  Expires: {new Date(certification.expirationDate + '-01').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short'
                  })}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CertificationsPreview;
