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
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add Your top professional key skills (Maximum 3 skills)</p>

      <div>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between mb-2 border rounded-lg p-3 "
          >
            <div>
              <label className="text-xs">Name</label>
              <Input
                className="w-full"
                defaultValue={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs">Skill Level</label>
              <StarRating
                rating={item.rating}
                onRatingChange={(v) => handleChange(index, "rating", v)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2 flex-col">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={AddNewSkills}
              className="text-primary"
              disabled={skillsList.length >= 3}
            >
              {" "}
              + Add More Skill
            </Button>
            <Button
              variant="outline"
              onClick={RemoveSkills}
              className="text-primary"
              disabled={skillsList.length <= 1}
            >
              {" "}
              - Remove
            </Button>
          </div>
          {skillsList.length >= 3 && (
            <p className="text-xs text-gray-500">Maximum 3 skills reached</p>
          )}
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Skills;
