import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { AIChatSession } from "@/Services/AiModel";

const PROMPT = `Please enhance and improve the following education description while preserving the user's original intent and key points:

Original Description: "{originalDescription}"

Education Context:
- Degree: {degree}
- Major: {major}
- University: {universityName}

Instructions:
1. Use the original description and the education context provided and try to include the degree and major as the primary source material
2. Enhance the language to be more professional and polished
3. Improve structure and flow while maintaining the user's personal experiences and achievements
4. Keep all specific details, accomplishments, and experiences mentioned by the user
5. Make it more compelling for employers while staying true to the original content
6. Ensure the enhanced version is 2-4 sentences and professionally formatted
7. Format important technical terms, subjects, and technologies in **bold** (e.g., **Computer Science**, **Machine Learning**, **Data Analysis**)

Return ONLY a valid JSON object with this exact format:
{
  "degree": "{degree}",
  "major": "{major}",
  "universityName": "{universityName}",
  "description": "The enhanced and improved version of the user's original description"
}
Do not include any other text, explanations, or formatting. Return only the JSON object.`;

const formFields = {
  universityName: "",
  degree: "",
  major: "",
  grade: "",
  gradeType: "CGPA",
  startDate: "",
  endDate: "",
  description: "",
};
function Education({ resumeInfo, enanbledNext }) {
  const [educationalList, setEducationalList] = React.useState(
    resumeInfo?.education || [{ ...formFields }]
  );
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [aiLoading, setAiLoading] = useState({});

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, education: educationalList }));
  }, [educationalList]);

  const AddNewEducation = () => {
    setEducationalList([...educationalList, { ...formFields }]);
  };

  const RemoveEducation = () => {
    setEducationalList((educationalList) => educationalList.slice(0, -1));
  };

  const onSave = () => {
    if (educationalList.length === 0) {
      return toast("Please add atleast one education", "error");
    }
    setLoading(true);
    const data = {
      data: {
        education: educationalList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Education");
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

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...educationalList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setEducationalList(list);
  };

  // Check if education description has content to enable/disable AI button
  const hasEducationDescriptionContent = (index) => {
    const description = educationalList[index]?.description;
    return description && description.trim().length > 0;
  };

  const GenerateEducationDescriptionFromAI = async (index) => {
    // Double-check that user has entered education description content
    if (!hasEducationDescriptionContent(index)) {
      toast("Please write your own education description first before using AI enhancement", "error");
      return;
    }

    const education = educationalList[index];
    if (!education?.degree || !education?.universityName) {
      toast("Please add Degree and University Name first", "error");
      return;
    }

    setAiLoading(prev => ({ ...prev, [index]: true }));

    const prompt = PROMPT.replace("{originalDescription}", education.description)
                          .replace("{degree}", education.degree)
                          .replace("{major}", education.major || "")
                          .replace("{universityName}", education.universityName);

    try {
      console.log("Education AI Prompt:", prompt);
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = result.response.text();
      console.log("Raw AI Response:", responseText);

      // Parse the JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
        console.log("Parsed AI Response:", parsedResponse);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        toast("Error parsing AI response. Please try again.", "error");
        return;
      }

      // Validate the response structure
      if (!parsedResponse || typeof parsedResponse !== 'object') {
        console.error("Invalid AI response structure:", parsedResponse);
        toast("AI returned unexpected response format. Please try again.", "error");
        return;
      }

      // Extract description with multiple fallback options
      let enhancedDescription = null;
      if (typeof parsedResponse.description === 'string' && parsedResponse.description.trim().length > 0) {
        enhancedDescription = parsedResponse.description.trim();
      } else if (typeof parsedResponse.summary === 'string' && parsedResponse.summary.trim().length > 0) {
        enhancedDescription = parsedResponse.summary.trim();
      } else if (typeof parsedResponse.text === 'string' && parsedResponse.text.trim().length > 0) {
        enhancedDescription = parsedResponse.text.trim();
      }

      // Validate that we have a proper description
      if (!enhancedDescription) {
        console.error("No valid description found in AI response:", parsedResponse);
        toast("AI response doesn't contain valid education description. Please try again.", "error");
        return;
      }

      // Update the education description
      const list = [...educationalList];
      list[index] = {
        ...list[index],
        description: enhancedDescription
      };
      setEducationalList(list);

      toast("AI enhanced and improved your education description while preserving your original content!", "success");

    } catch (error) {
      console.error("AI Generation Error:", error);
      toast("Error generating AI suggestions", error.message || "Please try again");
    } finally {
      setAiLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Formations</h2>
      <p>Add your education details first, then use AI to enhance your descriptions</p>

      <div>
        {educationalList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2">
                <label>University Name</label>
                <Input
                  name="universityName"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.universityName}
                />
              </div>
              <div>
                <label>Degree</label>
                <Input
                  name="degree"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.degree}
                />
              </div>
              <div>
                <label>Major</label>
                <Input
                  name="major"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.major}
                />
              </div>
              <div>
                <label>Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.startDate}
                />
              </div>
              <div>
                <label>End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.endDate}
                />
              </div>
              <div className="col-span-2">
                <label>Grade</label>
                <div className="flex justify-center items-center gap-4">
                  <select
                    name="gradeType"
                    className="py-2 px-4 rounded-md"
                    onChange={(e) => handleChange(e, index)}
                    value={item?.gradeType}
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="GPA">GPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                  <Input
                    type="text"
                    name="grade"
                    onChange={(e) => handleChange(e, index)}
                    defaultValue={item?.grade}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex justify-between my-2">
                  <label>Education Description</label>
                  {hasEducationDescriptionContent(index) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => GenerateEducationDescriptionFromAI(index)}
                      disabled={aiLoading[index]}
                      className="flex gap-2 border-primary text-primary"
                    >
                      {aiLoading[index] ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" /> Enhance with AI
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="text-xs text-gray-500 italic">
                      Write your education description first to enable AI enhancement
                    </div>
                  )}
                </div>
                {!hasEducationDescriptionContent(index) && (
                  <div className="text-sm text-gray-500 mb-2 p-2 bg-gray-50 rounded border">
                    💡 <strong>Tip:</strong> Write about your academic achievements, relevant coursework, projects, research, or skills gained during your education.
                    Once you've written your description, AI will enhance and improve your content while preserving your personal experiences and achievements.
                  </div>
                )}
                <Textarea
                  name="description"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.description}
                  placeholder="Describe your academic achievements, relevant coursework, projects, research, or skills gained during this education..."
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
            onClick={AddNewEducation}
            className="text-primary"
          >
            {" "}
            + Add More Education
          </Button>
          <Button
            variant="outline"
            onClick={RemoveEducation}
            className="text-primary"
          >
            {" "}
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={() => onSave()}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Education;
