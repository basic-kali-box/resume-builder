import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

// Custom Star Rating Component
const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            star <= (hoverRating || rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-none text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ))}
    </div>
  );
};

function Skills({ resumeInfo, enanbledNext }) {
  const [loading, setLoading] = React.useState(false);
  const [skillsList, setSkillsList] = React.useState(
    resumeInfo?.skills || [
      {
        name: "",
        rating: 0,
      },
    ]
  );
  const dispatch = useDispatch();
  const { resume_id } = useParams();

  useEffect(() => {
    try {
      dispatch(addResumeData({ ...resumeInfo, skills: skillsList }));
    } catch (error) {
      console.log("error in experience context update", error);
    }
  }, [skillsList]);

  const AddNewSkills = () => {
    if (skillsList.length >= 3) {
      toast.error("Maximum 3 skills allowed");
      return;
    }
    const list = [...skillsList];
    list.push({ name: "", rating: 0 });
    setSkillsList(list);
  };

  const RemoveSkills = () => {
    const list = [...skillsList];
    list.pop();
    setSkillsList(list);
  };

  const handleChange = (index, key, value) => {
    const list = [...skillsList];
    const newListData = {
      ...list[index],
      [key]: value,
    };
    list[index] = newListData;
    setSkillsList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        skills: skillsList,
      },
    };

    if (resume_id) {
      console.log("Started Updating Skills");
      updateThisResume(resume_id, data)
        .then((resp) => {
          console.log(resp);

          // Update Redux store with the complete updated resume data
          if (resp && resp.data) {
            dispatch(addResumeData(resp.data));
          }

          toast("Resume Updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div className="mobile-card border-t-primary border-t-4 mt-6 sm:mt-10">
      <h2 className="font-bold text-lg sm:text-xl">Skills</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4">Add Your top professional key skills (Maximum 3 skills)</p>

      <div className="space-y-4">
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:justify-between gap-4 border rounded-lg p-4"
          >
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2">Skill Name</label>
              <Input
                className="w-full btn-touch"
                defaultValue={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="e.g., JavaScript, Project Management"
              />
            </div>
            <div className="flex flex-col items-center gap-2 sm:min-w-[120px]">
              <label className="text-sm font-medium text-gray-700">Skill Level</label>
              <StarRating
                rating={item.rating}
                onRatingChange={(v) => handleChange(index, "rating", v)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={AddNewSkills}
              className="text-primary btn-touch"
              disabled={skillsList.length >= 3}
            >
              + Add More Skill
            </Button>
            <Button
              variant="outline"
              onClick={RemoveSkills}
              className="text-primary btn-touch"
              disabled={skillsList.length <= 1}
            >
              - Remove Skill
            </Button>
          </div>
          {skillsList.length >= 3 && (
            <p className="text-xs text-gray-500">Maximum 3 skills reached</p>
          )}
        </div>
        <Button
          disabled={loading}
          onClick={onSave}
          className="btn-touch w-full sm:w-auto"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : "Save Skills"}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
