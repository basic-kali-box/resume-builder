import React, { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";

const prompt =
  `Job Title: {jobTitle}. Generate exactly 3 professional summaries for this job title at different experience levels (Entry Level, Mid Level, Senior Level). Format important technical terms, skills, and technologies in **bold** (e.g., **JavaScript**, **React**, **AWS**, **Machine Learning**). Return ONLY a valid JSON array with this exact format:
[
  {"summary": "3-4 line professional summary text with **bold** technical terms", "experience_level": "Entry Level"},
  {"summary": "3-4 line professional summary text with **bold** technical terms", "experience_level": "Mid Level"},
  {"summary": "3-4 line professional summary text with **bold** technical terms", "experience_level": "Senior Level"}
]
Do not include any other text, explanations, or formatting. Return only the JSON array.`;
function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Declare the undeclared variable using useState
  const [summary, setSummary] = useState(resumeInfo?.summary || ""); // Declare the undeclared variable using useState
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState(null); // Declare the undeclared variable using useState
  const { resume_id } = useParams();

  // Check if summary has content to enable/disable AI button
  const hasSummaryContent = summary && summary.trim().length > 0;

  const handleInputChange = (e) => {
    enanbledNext(false);
    enanbledPrev(false);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setSummary(e.target.value);
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Started Saving Summary");
    const data = {
      data: { summary },
    };
    if (resume_id) {
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
  }; // Declare the undeclared variable using useState

  const setSummery = (summary) => {
    dispatch(
      addResumeData({
        ...resumeInfo,
        summary: summary,
      })
    );
    setSummary(summary);
  };

  const GenerateSummeryFromAI = async () => {
    // Double-check that user has entered summary content
    if (!hasSummaryContent) {
      toast("Please write your own summary first before using AI enhancement", "error");
      return;
    }

    setLoading(true);
    console.log("Generate Summary From AI for", resumeInfo?.jobTitle);
    if (!resumeInfo?.jobTitle) {
      toast("Please Add Job Title", "error");
      setLoading(false);
      return;
    }
    const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);
    try {
      const result = await AIChatSession.sendMessage(PROMPT);
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

      // Validate and extract the array from the response
      let summaryArray = null;

      // Check if the response is directly an array
      if (Array.isArray(parsedResponse)) {
        summaryArray = parsedResponse;
      }
      // Check if the response has a property that contains the array
      else if (parsedResponse && typeof parsedResponse === 'object') {
        // Try common property names that might contain the array
        const possibleArrayKeys = ['summaries', 'summary', 'data', 'results', 'suggestions'];
        for (const key of possibleArrayKeys) {
          if (Array.isArray(parsedResponse[key])) {
            summaryArray = parsedResponse[key];
            break;
          }
        }

        // If no array found in common keys, check all properties
        if (!summaryArray) {
          const values = Object.values(parsedResponse);
          const arrayValue = values.find(value => Array.isArray(value));
          if (arrayValue) {
            summaryArray = arrayValue;
          }
        }
      }

      // Validate that we have a proper array with expected structure
      if (!summaryArray || !Array.isArray(summaryArray) || summaryArray.length === 0) {
        console.error("Invalid AI response structure:", parsedResponse);
        toast("AI returned unexpected response format. Please try again.", "error");
        return;
      }

      // Validate array items have expected structure
      const validSummaries = summaryArray.filter(item =>
        item &&
        typeof item === 'object' &&
        typeof item.summary === 'string' &&
        item.summary.trim().length > 0
      );

      if (validSummaries.length === 0) {
        console.error("No valid summaries found in AI response:", summaryArray);
        toast("AI response doesn't contain valid summaries. Please try again.", "error");
        return;
      }

      // Set the validated array
      setAiGenerateSummeryList(validSummaries);
      toast(`AI generated ${validSummaries.length} suggestion(s) successfully! Choose one below to enhance your summary.`, "success");

    } catch (error) {
      console.error("AI Generation Error:", error);
      toast("Error generating AI suggestions", error.message || "Please try again");
      // Reset the suggestions list on error
      setAiGenerateSummeryList(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Write your professional summary first, then use AI to enhance it</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summery</label>
            {hasSummaryContent ? (
              <Button
                variant="outline"
                onClick={() => GenerateSummeryFromAI()}
                type="button"
                size="sm"
                className="border-primary text-primary flex gap-2"
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {loading ? "Generating..." : "Enhance with AI"}
              </Button>
            ) : (
              <div className="text-xs text-gray-500 italic">
                Enter your summary first to enable AI enhancement
              </div>
            )}
          </div>
          <Textarea
            name="summary"
            className="mt-5"
            required
            placeholder="Write a brief professional summary about yourself, your skills, and experience. Once you've written your summary, you can use AI to enhance it."
            value={summary ? summary : resumeInfo?.summary}
            onChange={handleInputChange}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList && Array.isArray(aiGeneratedSummeryList) && aiGeneratedSummeryList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          <p className="text-sm text-gray-600 mb-3">
            Click on any suggestion below to replace your current summary:
          </p>
          {aiGeneratedSummeryList.map((item, index) => {
            // Additional safety check for each item
            if (!item || typeof item !== 'object' || !item.summary) {
              return null;
            }

            return (
              <div
                key={index}
                onClick={() => {
                  enanbledNext(false);
                  enanbledPrev(false);
                  setSummery(item.summary);
                }}
                className="p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:shadow-xl transition-shadow border border-gray-200 hover:border-primary"
              >
                <h2 className="font-bold my-1 text-primary">
                  Level: {item?.experience_level || 'General'}
                </h2>
                <p className="text-gray-700">{item.summary}</p>
              </div>
            );
          })}
        </div>
      )}

      {aiGeneratedSummeryList && (!Array.isArray(aiGeneratedSummeryList) || aiGeneratedSummeryList.length === 0) && (
        <div className="my-5 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            No valid AI suggestions were generated. Please try again or check your job title.
          </p>
        </div>
      )}
    </div>
  );
}

export default Summary;
