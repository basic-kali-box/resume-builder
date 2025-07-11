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

const PROMPT = `Please enhance and improve the following project description while preserving the user's original intent and specific project details:

Original Description: "{originalDescription}"

Project Context:
- Project Name: {projectName}
- Tech Stack: {techStack}
- User's Education: {degree} in {major}

Instructions:
1. Use the original description and major as the primary source material, and focus on utilizing technologies mentioned in the tech stack or even seed with similar technologies/frameworks if not mentioned (use names) with **bold** formatting.
2. Enhance the language to be more professional and polished
3. Improve structure and flow while maintaining all specific project features, technologies, and achievements mentioned by the user
4. Keep all technical details, challenges solved, and personal contributions described by the user
5. Make it more compelling for employers while staying true to the original content
6. Consider the user's educational background to make enhancements relevant to their field of study
7. Format as 4-6 professional bullet points in HTML list format
8. Format important technical terms, frameworks, languages, and tools in **bold** (e.g., **React**, **Node.js**, **MongoDB**, **API**)

Return ONLY a valid JSON object with this exact format:
{
  "projectName": "{projectName}",
  "techStack": "{techStack}",
  "projectSummary": ["<li>Enhanced bullet point 1</li>", "<li>Enhanced bullet point 2</li>", "<li>Enhanced bullet point 3</li>", "<li>Enhanced bullet point 4</li>"]
}
Do not include any other text, explanations, or formatting. Return only the JSON object.`;

function SimpeRichTextEditor({ index, onRichTextEditorChange, resumeInfo, defaultValue }) {
  const [value, setValue] = useState(
    defaultValue || resumeInfo?.projects[index]?.projectSummary || ""
  );
  const [loading, setLoading] = useState(false);

  // Trial context
  const { canUseAI, handleTrialExhaustion, updateTrialStatusFromResponse } = useTrial();

  // Check if project summary has content to enable/disable AI button
  const hasProjectSummaryContent = value && value.trim().length > 0;

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    // Check trial availability first
    if (!canUseAI()) {
      handleTrialExhaustion();
      return;
    }

    // Double-check that user has entered project summary content
    if (!hasProjectSummaryContent) {
      toast("Please write your own project description first before using AI enhancement", "error");
      return;
    }

    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Please add Project Name and Tech Stack first", "error");
      return;
    }

    setLoading(true);

    // Get user's education context for more relevant enhancements
    const userEducation = resumeInfo?.education?.[0] || {};
    const degree = userEducation.degree || "Not specified";
    const major = userEducation.major || "Not specified";

    const prompt = PROMPT.replace("{originalDescription}", value)
                          .replace("{projectName}", resumeInfo?.projects[index]?.projectName)
                          .replace("{techStack}", resumeInfo?.projects[index]?.techStack)
                          .replace("{degree}", degree)
                          .replace("{major}", major);

    try {
      console.log("Prompt", prompt);
      const result = await BackendAIChatSession.sendMessage(prompt, 'education');
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

      // Extract project summary array with multiple fallback options
      let projectSummaryArray = null;
      if (Array.isArray(parsedResponse.projectSummary)) {
        projectSummaryArray = parsedResponse.projectSummary;
      } else if (Array.isArray(parsedResponse.summary)) {
        projectSummaryArray = parsedResponse.summary;
      } else if (Array.isArray(parsedResponse.bullets)) {
        projectSummaryArray = parsedResponse.bullets;
      } else if (Array.isArray(parsedResponse.points)) {
        projectSummaryArray = parsedResponse.points;
      } else if (Array.isArray(parsedResponse.description)) {
        projectSummaryArray = parsedResponse.description;
      }

      // Validate that we have a proper array
      if (!projectSummaryArray || !Array.isArray(projectSummaryArray) || projectSummaryArray.length === 0) {
        console.error("No valid project summary array found in AI response:", parsedResponse);
        toast("AI response doesn't contain valid project description points. Please try again.", "error");
        return;
      }

      // Filter out invalid entries and join the array
      const validProjectSummary = projectSummaryArray.filter(item =>
        typeof item === 'string' && item.trim().length > 0
      );

      if (validProjectSummary.length === 0) {
        console.error("No valid project summary points found:", projectSummaryArray);
        toast("AI response doesn't contain valid project content. Please try again.", "error");
        return;
      }

      // Set the enhanced content
      setValue(validProjectSummary.join(""));
      toast(`AI enhanced and improved your project description with ${validProjectSummary.length} bullet points while preserving your original content!`, "success");

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
          <label className="text-sm font-semibold text-gray-900">Project Description</label>
          <p className="text-xs text-gray-500">
            Describe your project's features, technologies, and achievements
          </p>
        </div>
        {hasProjectSummaryContent ? (
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
            Write your project description first to enable AI enhancement
          </div>
        )}
      </div>
      {/* Helpful Tip Section */}
      {!hasProjectSummaryContent && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💡</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Writing Tip</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Write about your project's <strong>key features</strong>, <strong>technologies used</strong>,
            <strong> challenges solved</strong>, and <strong>achievements</strong>. Once you've written your description,
            AI will enhance and improve your content while preserving your specific project details and contributions.
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
            placeholder="Describe your project's key features, technologies used, challenges solved, and achievements..."
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
            {hasProjectSummaryContent && (
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

export default SimpeRichTextEditor;
