import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { BackendAIChatSession } from "@/Services/BackendAiService";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Sparkles, LoaderCircle } from "lucide-react";
import { useTrial } from "@/context/TrialContext";
import { TrialBadge } from "./TrialCounter";
import "./RichTextEditor.css";

const PROMPT = `Please enhance and improve the following work experience description while preserving the user's original intent and specific achievements:

Original Description: "{originalDescription}"

Work Experience Context:
- Position Title: {positionTitle}
- Company: {companyName}
- User's Education: {degree} in {major}

Instructions:
1. Use the original description and degree and major as the primary source material
2. Enhance the language to be more professional and polished
3. Improve structure and flow while maintaining all specific responsibilities, achievements, and experiences mentioned by the user
4. Keep all quantifiable results, projects, and personal contributions described by the user
5. Make it more compelling for employers while staying true to the original content
6. Consider the user's educational background to make enhancements relevant to their field of study
7. Format important technical terms, skills, technologies, and tools in **bold** (e.g., **Python**, **AWS**, **Agile**, **SQL**)
8. Format as 4-6 professional bullet points in HTML list format

Return ONLY a valid JSON object with this exact format:
{
  "position_Title": "{positionTitle}",
  "experience": ["<li>Enhanced bullet point 1</li>", "<li>Enhanced bullet point 2</li>", "<li>Enhanced bullet point 3</li>", "<li>Enhanced bullet point 4</li>", "<li>Enhanced bullet point 5</li>"]
}
Do not include any other text, explanations, or formatting. Return only the JSON object.`;

function RichTextEditor({ onRichTextEditorChange, index, resumeInfo, defaultValue }) {
  const [value, setValue] = useState(
    defaultValue || resumeInfo?.experience[index]?.workSummary || ""
  );
  const [loading, setLoading] = useState(false);

  // Trial context
  const { canUseAI, handleTrialExhaustion, updateTrialStatusFromResponse } = useTrial();

  // Check if work summary has content to enable/disable AI button
  const hasWorkSummaryContent = value && value.trim().length > 0;

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    // Check trial availability first
    if (!canUseAI()) {
      handleTrialExhaustion();
      return;
    }

    // Double-check that user has entered work summary content
    if (!hasWorkSummaryContent) {
      toast("Please write your own work experience description first before using AI enhancement", "error");
      return;
    }

    if (!resumeInfo?.experience[index]?.title) {
      toast("Please Add Position Title", "error");
      return;
    }

    setLoading(true);

    // Get user's education context for more relevant enhancements
    const userEducation = resumeInfo?.education?.[0] || {};
    const degree = userEducation.degree || "Not specified";
    const major = userEducation.major || "Not specified";
    const companyName = resumeInfo?.experience[index]?.companyName || "Not specified";

    const prompt = PROMPT.replace("{originalDescription}", value)
                        .replace("{positionTitle}", resumeInfo.experience[index].title)
                        .replace("{companyName}", companyName)
                        .replace("{degree}", degree)
                        .replace("{major}", major);

    try {
      const result = await BackendAIChatSession.sendMessage(prompt, 'experience');
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
        toast("Error parsing AI response. Please try again.", "error");
        return;
      }

      // Validate the response structure
      if (!parsedResponse || typeof parsedResponse !== 'object') {
        console.error("Invalid AI response structure:", parsedResponse);
        toast("AI returned unexpected response format. Please try again.", "error");
        return;
      }

      // Extract experience array with multiple fallback options
      let experienceArray = null;
      if (Array.isArray(parsedResponse.experience)) {
        experienceArray = parsedResponse.experience;
      } else if (Array.isArray(parsedResponse.experience_bullets)) {
        experienceArray = parsedResponse.experience_bullets;
      } else if (Array.isArray(parsedResponse.bullets)) {
        experienceArray = parsedResponse.bullets;
      } else if (Array.isArray(parsedResponse.points)) {
        experienceArray = parsedResponse.points;
      }

      // Validate that we have a proper array
      if (!experienceArray || !Array.isArray(experienceArray) || experienceArray.length === 0) {
        console.error("No valid experience array found in AI response:", parsedResponse);
        toast("AI response doesn't contain valid experience points. Please try again.", "error");
        return;
      }

      // Filter out invalid entries and join the array
      const validExperience = experienceArray.filter(item =>
        typeof item === 'string' && item.trim().length > 0
      );

      if (validExperience.length === 0) {
        console.error("No valid experience points found:", experienceArray);
        toast("AI response doesn't contain valid experience content. Please try again.", "error");
        return;
      }

      // Set the enhanced content
      setValue(validExperience.join(""));
      toast(`AI enhanced and improved your experience with ${validExperience.length} bullet points while preserving your original content!`, "success");

    } catch (error) {
      console.error("AI Generation Error:", error);
      toast("Error generating AI suggestions", error.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-900">Work Experience Description</label>
          <p className="text-xs text-gray-500">
            Describe your key responsibilities, achievements, and skills for this role
          </p>
        </div>
        {hasWorkSummaryContent ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={GenerateSummaryFromAI}
              disabled={loading || !canUseAI()}
              className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Enhancing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Enhance with AI</span>
                </>
              )}
            </Button>
            <TrialBadge />
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic max-w-48 text-right">
            Write your experience first to enable AI enhancement
          </div>
        )}
      </div>
      {/* Helpful Tip Section */}
      {!hasWorkSummaryContent && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💡</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Writing Tip</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Write about your <strong>key responsibilities</strong>, <strong>achievements</strong>, and
            <strong> skills</strong> for this role. Once you've written your experience, AI will enhance
            and improve your content while preserving your specific accomplishments and contributions.
          </p>
        </div>
      )}
      {/* Rich Text Editor */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <EditorProvider>
          <Editor
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onRichTextEditorChange(value);
            }}
            placeholder="Describe your key responsibilities, achievements, and skills for this role..."
            containerProps={{
              style: {
                minHeight: '120px',
                maxHeight: '300px',
                resize: 'vertical',
                overflow: 'auto'
              }
            }}
          >
            <Toolbar>
              <BtnBold />
              <BtnItalic />
              <BtnUnderline />
              <BtnStrikeThrough />
              <Separator />
              <BtnNumberedList />
              <BtnBulletList />
              <Separator />
              <BtnLink />
            </Toolbar>
          </Editor>
        </EditorProvider>

        {/* Footer with character count and status */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              {value.replace(/<[^>]*>/g, '').length} characters
            </span>
            {hasWorkSummaryContent && (
              <span className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Ready for AI enhancement
              </span>
            )}
          </div>
          <div className="text-gray-400">
            Use formatting tools above to style your content
          </div>
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;
