import React from "react";
import { Star } from "lucide-react";

function SkillsPreview({ resumeInfo }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= rating
              ? "fill-current"
              : "fill-none"
          }`}
          style={{
            color: resumeInfo?.themeColor || "#000",
          }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="my-6">
      {resumeInfo?.skills.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-2"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            Skills
          </h2>
          <hr
            style={{
              borderColor: resumeInfo?.themeColor,
            }}
          />
        </div>
      )}

      <div className="space-y-3 my-4">
        {resumeInfo?.skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between">
            <h2 className="text-xs font-medium">{skill.name}</h2>
            {skill.name ? (
              <div className="flex items-center gap-1">
                {renderStars(skill?.rating || 0)}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsPreview;
