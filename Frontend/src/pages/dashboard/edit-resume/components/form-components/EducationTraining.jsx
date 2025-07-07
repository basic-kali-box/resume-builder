import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateResumeData } from "@/Services/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

function EducationTraining({ resumeInfo, enabledNext }) {
  const [loading, setLoading] = React.useState(false);
  const [educationTrainingList, setEducationTrainingList] = React.useState(
    resumeInfo?.educationTraining || [
      {
        courseName: "",
        institution: "",
        completionDate: "",
        description: "",
      },
    ]
  );

  const dispatch = useDispatch();
  const { resume_id } = useParams();

  useEffect(() => {
    if (resumeInfo?.educationTraining?.length > 0) {
      setEducationTrainingList(resumeInfo.educationTraining);
    }
  }, [resumeInfo]);

  const handleChange = (index, event) => {
    const newEntries = educationTrainingList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationTrainingList(newEntries);
  };

  const AddNewEducationTraining = () => {
    setEducationTrainingList([
      ...educationTrainingList,
      {
        courseName: "",
        institution: "",
        completionDate: "",
        description: "",
      },
    ]);
  };

  const RemoveEducationTraining = () => {
    setEducationTrainingList((educationTrainingList) => educationTrainingList.slice(0, -1));
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        educationTraining: educationTrainingList.map((item) => ({
          courseName: item?.courseName,
          institution: item?.institution,
          completionDate: item?.completionDate,
          description: item?.description,
        })),
      },
    };

    updateThisResume(resume_id, data)
      .then((resp) => {
        console.log(resp);

        // Update Redux store with the complete updated resume data
        if (resp && resp.data) {
          dispatch(addResumeData(resp.data));
        }

        setLoading(false);
        toast.success("Education/Training updated successfully!");
        enabledNext(true);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Failed to update education/training");
        console.error(error);
      });
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education & Training</h2>
      <p>Add your additional courses, training, and professional development</p>
      <div>
        {educationTrainingList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div>
                <label className="text-xs">Course/Training Name</label>
                <Input
                  name="courseName"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.courseName}
                  placeholder="e.g., Advanced React Development"
                />
              </div>
              <div>
                <label className="text-xs">Institution/Provider</label>
                <Input
                  name="institution"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.institution}
                  placeholder="e.g., Coursera, Udemy, Company Training"
                />
              </div>
              <div>
                <label className="text-xs">Completion Date</label>
                <Input
                  name="completionDate"
                  type="month"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.completionDate}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs">Description (Optional)</label>
                <Textarea
                  name="description"
                  onChange={(event) => handleChange(index, event)}
                  value={item?.description}
                  placeholder="Brief description of what you learned or achieved"
                  className="h-20"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewEducationTraining}
            className="text-primary"
          >
            + Add More Training
          </Button>
          <Button
            variant="outline"
            onClick={RemoveEducationTraining}
            className="text-primary"
            disabled={educationTrainingList.length <= 1}
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default EducationTraining;
