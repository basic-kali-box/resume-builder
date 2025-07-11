import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpeRichTextEditor from "@/components/custom/SimpeRichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  projectName: "",
  techStack: "",
  projectSummary: "",
};
function Project({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [projectList, setProjectList] = useState(resumeInfo?.projects || []);
  const [loading, setLoading] = useState(false);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, projects: projectList }));
  }, [projectList]);

  const addProject = () => {
    setProjectList([...projectList, formFields]);
  };

  const removeProject = (index) => {
    const list = [...projectList];
    const newList = list.filter((item, i) => {
      if (i !== index) return true;
    });
    setProjectList(newList);
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    console.log("Type: ", typeof setEnabledPrev);
    const { name, value } = e.target;
    const list = [...projectList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setProjectList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...projectList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setProjectList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        projects: projectList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Project");
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
          setEnabledNext(true);
          setEnabledPrev(true);
          setLoading(false);
        });
    }
  };

  return (
    <div className="mobile-card border-t-primary border-t-4 mt-6 sm:mt-10">
      <h2 className="font-bold text-lg sm:text-xl">Projects</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6">Add your project details first, then use AI to enhance your descriptions</p>

      <div className="space-y-6">
        {projectList?.map((project, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Project {index + 1}</h3>
              {projectList.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 btn-touch"
                  onClick={() => {
                    removeProject(index);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mobile-form-grid gap-4">
              <div>
                <label className="text-xs">Project Name</label>
                <Input
                  type="text"
                  name="projectName"
                  value={project?.projectName}
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                />
              </div>
              <div>
                <label className="text-xs">Tech Stack</label>
                <Input
                  type="text"
                  name="techStack"
                  value={project?.techStack}
                  placeholder="React, Node.js, Express, MongoDB"
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                />
              </div>
              <div className="col-span-2">
                <SimpeRichTextEditor
                  index={index}
                  defaultValue={project?.projectSummary}
                  onRichTextEditorChange={(event) =>
                    handleRichTextEditor(event, "projectSummary", index)
                  }
                  resumeInfo={resumeInfo}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-2">
        <Button onClick={addProject} variant="outline" className="text-primary">
          + Add {resumeInfo?.experience?.length > 0 ? "more" : null} project
        </Button>
        <Button onClick={onSave}>
          {loading ? <LoaderCircle className=" animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Project;
