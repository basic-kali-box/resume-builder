import React, { useState } from "react";
import { Sparkles, LoaderCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValidatedTextarea } from "@/components/ui/enhanced-form";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { BackendAIChatSession } from "@/Services/BackendAiService";
import { updateThisResume } from "@/Services/resumeAPI";
import { useTrial } from "@/context/TrialContext";
import { TrialBadge } from "@/components/custom/TrialCounter";
import { TrialWarningPopup } from "@/components/custom/TrialExhaustedModal";
import { useTrialWarning } from "@/hooks/useTrialWarning";
import { AILoadingIndicator } from "@/components/ui/loading-states";
import { enhancedToast, aiToast } from "@/components/ui/enhanced-toast";

// Utility function to convert markdown bold to HTML
const convertMarkdownToHTML = (text) => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

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

  // Trial context with new popup system
  const { updateTrialStatusFromResponse } = useTrial();
  const { isWarningOpen, checkTrialsAndWarn, closeWarning } = useTrialWarning();

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
    // Check trial availability with new popup system
    if (!checkTrialsAndWarn()) {
      return; // checkTrialsAndWarn handles showing the popup
    }

    // Double-check that user has entered summary content
    if (!hasSummaryContent) {
      aiToast.error("Please write your own summary first", {
        description: "Enter your baseline content before using AI enhancement"
      });
      return;
    }

    setLoading(true);
    console.log("Generate Summary From AI for", resumeInfo?.jobTitle);
    if (!resumeInfo?.jobTitle) {
      aiToast.error("Job title required", {
        description: "Please add a job title before generating AI suggestions"
      });
      setLoading(false);
      return;
    }
    const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);
    try {
      const result = await BackendAIChatSession.sendMessage(PROMPT, 'summary');
      const responseText = result.response.text();
      console.log("Raw AI Response:", responseText);

      // Update trial status if available
      if (result.trialStatus) {
        updateTrialStatusFromResponse({ trialStatus: result.trialStatus });
      }

      // Parse the JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
        console.log("Parsed AI Response:", parsedResponse);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        aiToast.error("Error parsing AI response", {
          description: "Please try again"
        });
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
        aiToast.error("AI returned unexpected response format", {
          description: "Please try again"
        });
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
        aiToast.error("No valid summaries found", {
          description: "Please try again"
        });
        return;
      }

      // Set the validated array
      setAiGenerateSummeryList(validSummaries);
      aiToast.success(`Generated ${validSummaries.length} AI suggestion(s)`, {
        description: "Choose one below to enhance your summary"
      });

    } catch (error) {
      console.error("AI Generation Error:", error);
      aiToast.error("Failed to generate AI suggestions", {
        description: error.message || "Please try again"
      });
      // Reset the suggestions list on error
      setAiGenerateSummeryList(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mobile-card border-t-primary border-t-4 mt-6 sm:mt-10">
        <h2 className="font-bold text-lg sm:text-xl">Summary</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">Write your professional summary first, then use AI to enhance it</p>

        <form className="space-y-4" onSubmit={onSave}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
            <label className="text-sm font-medium text-gray-700">Professional Summary *</label>
            {hasSummaryContent ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="gradient"
                  onClick={() => GenerateSummeryFromAI()}
                  type="button"
                  size="sm"
                  className="btn-touch interactive-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Enhance with AI
                    </>
                  )}
                </Button>
                <TrialBadge />
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">
                Enter your summary first to enable AI enhancement
              </div>
            )}
          </div>
          <Textarea
            name="summary"
            className="btn-touch min-h-[120px]"
            required
            placeholder="Write a brief professional summary about yourself, your skills, and experience. Once you've written your summary, you can use AI to enhance it."
            value={summary ? summary : resumeInfo?.summary}
            onChange={handleInputChange}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="btn-touch w-full sm:w-auto"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : "Save Summary"}
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
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(item.summary) }}
                />
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

      {/* Trial Warning Popup */}
      <TrialWarningPopup
        isOpen={isWarningOpen}
        onClose={closeWarning}
      />
    </div>
  );
}

export default Summary;
