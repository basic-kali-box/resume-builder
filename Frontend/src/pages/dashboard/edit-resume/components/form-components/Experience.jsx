import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateResumeData } from "@/Services/GlobalApi";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: "",
  workSummary: "",
};
function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const [experienceList, setExperienceList] = React.useState(
    resumeInfo?.experience || []
  );
  const [loading, setLoading] = React.useState(false);
  const { resume_id } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
    } catch (error) {
      console.log("error in experience context update", error.message);
    }
  }, [experienceList]);

  const addExperience = () => {
    if (!experienceList) {
      setExperienceList([formFields]);
      return;
    }
    setExperienceList([...experienceList, formFields]);
  };

  const removeExperience = (index) => {
    const list = [...experienceList];
    const newList = list.filter((item, i) => {
      if (i !== index) return true;
    });
    setExperienceList(newList);
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { name, value } = e.target;
    const list = [...experienceList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setExperienceList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...experienceList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setExperienceList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        experience: experienceList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Experience");
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
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };
  return (
    <div>
      <div className="mobile-card border-t-primary border-t-4 mt-6 sm:mt-10">
        <h2 className="font-bold text-lg sm:text-xl">Experience</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">Add your work experience details first, then use AI to enhance your descriptions</p>

        <div className="space-y-6">
          {experienceList?.map((experience, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Experience {index + 1}</h3>
                {experienceList.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 btn-touch"
                    onClick={(e) => {
                      removeExperience(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mobile-form-grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Position Title *</label>
                  <Input
                    type="text"
                    name="title"
                    value={experience?.title}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                    placeholder="e.g., Software Engineer"
                    className="btn-touch"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Company Name *</label>
                  <Input
                    type="text"
                    name="companyName"
                    value={experience?.companyName}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                    placeholder="e.g., Google Inc."
                    className="btn-touch"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">City</label>
                  <Input
                    type="text"
                    name="city"
                    value={experience?.city}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                    placeholder="e.g., San Francisco"
                    className="btn-touch"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">State</label>
                  <Input
                    type="text"
                    name="state"
                    value={experience?.state}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                    placeholder="e.g., CA"
                    className="btn-touch"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Start Date *</label>
                  <Input
                    type="date"
                    name="startDate"
                    value={experience?.startDate}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                    className="btn-touch"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    value={experience?.endDate}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                    className="btn-touch"
                    placeholder="Leave blank if current"
                  />
                </div>
                <div className="col-span-2">
                  <RichTextEditor
                    index={index}
                    defaultValue={experience?.workSummary}
                    onRichTextEditorChange={(event) =>
                      handleRichTextEditor(event, "workSummary", index)
                    }
                    resumeInfo={resumeInfo}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
          <Button
            onClick={addExperience}
            variant="outline"
            className="text-primary btn-touch flex items-center justify-center gap-2"
          >
            + Add {resumeInfo?.experience?.length > 0 ? "More" : ""} Experience
          </Button>
          <Button
            onClick={onSave}
            className="btn-touch w-full sm:w-auto"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Save Experience"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
