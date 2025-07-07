import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

/**
 * Automatic AI Enhancement Service
 * Enhances all extracted resume sections using AI after file upload
 */

// AI Prompts for different sections
const ENHANCEMENT_PROMPTS = {
  summary: `Job Title: {jobTitle}.

  Please enhance and improve the following professional summary while preserving the user's original intent and key points:

  Original Summary: "{originalSummary}"

  Requirements:
  - Preserve all specific details, achievements, and experiences mentioned
  - Enhance language to be more professional and impactful
  - Improve structure and flow while maintaining the original meaning
  - Keep the same length (3-4 lines)
  - Use action-oriented language and industry-relevant keywords
  - Maintain the user's personal voice and experiences
  - Format important technical terms, skills, and technologies in **bold** (e.g., **JavaScript**, **React**, **AWS**, **Machine Learning**)

  Return only the enhanced summary text with bold formatting applied to technical terms, no additional formatting or explanations.`,

  experience: `Please enhance and improve the following work experience description while preserving the user's original intent and key points:

  Job Title: {title}
  Company: {companyName}
  Original Description: "{originalDescription}"

  Requirements:
  - Preserve all specific achievements, metrics, and responsibilities mentioned
  - Enhance language to be more professional and impactful
  - Use strong action verbs and quantifiable results where possible
  - Improve structure and flow while maintaining the original meaning
  - Add industry-relevant keywords naturally
  - Maintain the user's personal experiences and accomplishments
  - Format important technical terms, skills, technologies, and tools in **bold** (e.g., **Python**, **AWS**, **Agile**, **SQL**)

  Return only the enhanced description text with bold formatting applied to technical terms, no additional formatting or explanations.`,

  education: `Please enhance and improve the following education description while preserving the user's original intent and key points:

  Degree: {degree}
  Major: {major}
  University: {universityName}
  Original Description: "{originalDescription}"

  Requirements:
  - Preserve all specific achievements, projects, and experiences mentioned
  - Enhance language to be more professional and academic
  - Highlight relevant coursework, research, or academic accomplishments
  - Improve structure and flow while maintaining the original meaning
  - Add relevant academic and industry keywords naturally
  - Maintain the user's personal academic experiences
  - Format important technical terms, subjects, and technologies in **bold** (e.g., **Computer Science**, **Machine Learning**, **Data Analysis**)

  Return only the enhanced description text with bold formatting applied to technical terms, no additional formatting or explanations.`,

  project: `Please enhance and improve the following project description while preserving the user's original intent and key points:

  Project Name: {projectName}
  Tech Stack: {techStack}
  Original Description: "{originalDescription}"

  Requirements:
  - Preserve all specific technical details, features, and outcomes mentioned
  - Enhance language to be more professional and technical
  - Highlight technical skills, methodologies, and results
  - Improve structure and flow while maintaining the original meaning
  - Add relevant technical keywords naturally
  - Maintain the user's personal project experiences and achievements
  - Format important technical terms, frameworks, languages, and tools in **bold** (e.g., **React**, **Node.js**, **MongoDB**, **API**)

  Return only the enhanced description text with bold formatting applied to technical terms, no additional formatting or explanations.`
};

/**
 * Helper function to extract text from AI response (handles JSON responses)
 */
const extractTextFromAIResponse = (responseText) => {
  try {
    // Try to parse as JSON first (in case AI returns JSON format)
    const parsed = JSON.parse(responseText);

    // Look for common JSON keys that might contain the enhanced text
    if (parsed.enhancedSummary) return parsed.enhancedSummary;
    if (parsed.enhancedDescription) return parsed.enhancedDescription;
    if (parsed.enhanced) return parsed.enhanced;
    if (parsed.text) return parsed.text;
    if (parsed.description) return parsed.description;
    if (parsed.summary) return parsed.summary;

    // If it's an object but no recognized keys, return the original response
    return responseText;
  } catch (error) {
    // Not JSON, return as plain text
    return responseText;
  }
};

/**
 * Enhance summary section using AI
 */
export const enhanceSummary = async (originalSummary, jobTitle) => {
  try {
    if (!originalSummary || !originalSummary.trim()) {
      return originalSummary;
    }

    const prompt = ENHANCEMENT_PROMPTS.summary
      .replace("{jobTitle}", jobTitle || "Professional")
      .replace("{originalSummary}", originalSummary);

    const result = await AIChatSession.sendMessage(prompt);
    const rawResponse = result.response.text().trim();
    const enhancedSummary = extractTextFromAIResponse(rawResponse);

    return enhancedSummary || originalSummary;
  } catch (error) {
    console.error("Error enhancing summary:", error);
    return originalSummary; // Return original on error
  }
};

/**
 * Enhance experience descriptions using AI
 */
export const enhanceExperience = async (experienceList) => {
  try {
    if (!experienceList || experienceList.length === 0) {
      return experienceList;
    }

    const enhancedExperience = [];

    for (const experience of experienceList) {
      if (experience.workSummary && experience.workSummary.trim()) {
        try {
          const prompt = ENHANCEMENT_PROMPTS.experience
            .replace("{title}", experience.title || "Professional")
            .replace("{companyName}", experience.companyName || "Company")
            .replace("{originalDescription}", experience.workSummary);

          const result = await AIChatSession.sendMessage(prompt);
          const rawResponse = result.response.text().trim();
          const enhancedDescription = extractTextFromAIResponse(rawResponse);

          enhancedExperience.push({
            ...experience,
            workSummary: enhancedDescription || experience.workSummary
          });
        } catch (error) {
          console.error(`Error enhancing experience for ${experience.title}:`, error);
          enhancedExperience.push(experience); // Keep original on error
        }
      } else {
        enhancedExperience.push(experience); // Keep as-is if no description
      }
    }

    return enhancedExperience;
  } catch (error) {
    console.error("Error enhancing experience list:", error);
    return experienceList; // Return original on error
  }
};

/**
 * Enhance education descriptions using AI
 */
export const enhanceEducation = async (educationList) => {
  try {
    if (!educationList || educationList.length === 0) {
      return educationList;
    }

    const enhancedEducation = [];

    for (const education of educationList) {
      if (education.description && education.description.trim()) {
        try {
          const prompt = ENHANCEMENT_PROMPTS.education
            .replace("{degree}", education.degree || "Degree")
            .replace("{major}", education.major || "Field of Study")
            .replace("{universityName}", education.universityName || "University")
            .replace("{originalDescription}", education.description);

          const result = await AIChatSession.sendMessage(prompt);
          const rawResponse = result.response.text().trim();
          const enhancedDescription = extractTextFromAIResponse(rawResponse);

          enhancedEducation.push({
            ...education,
            description: enhancedDescription || education.description
          });
        } catch (error) {
          console.error(`Error enhancing education for ${education.degree}:`, error);
          enhancedEducation.push(education); // Keep original on error
        }
      } else {
        enhancedEducation.push(education); // Keep as-is if no description
      }
    }

    return enhancedEducation;
  } catch (error) {
    console.error("Error enhancing education list:", error);
    return educationList; // Return original on error
  }
};

/**
 * Enhance project descriptions using AI
 */
export const enhanceProjects = async (projectsList) => {
  try {
    if (!projectsList || projectsList.length === 0) {
      return projectsList;
    }

    const enhancedProjects = [];

    for (const project of projectsList) {
      if (project.projectSummary && project.projectSummary.trim()) {
        try {
          const prompt = ENHANCEMENT_PROMPTS.project
            .replace("{projectName}", project.projectName || "Project")
            .replace("{techStack}", project.techStack || "Various Technologies")
            .replace("{originalDescription}", project.projectSummary);

          const result = await AIChatSession.sendMessage(prompt);
          const rawResponse = result.response.text().trim();
          const enhancedDescription = extractTextFromAIResponse(rawResponse);

          enhancedProjects.push({
            ...project,
            projectSummary: enhancedDescription || project.projectSummary
          });
        } catch (error) {
          console.error(`Error enhancing project ${project.projectName}:`, error);
          enhancedProjects.push(project); // Keep original on error
        }
      } else {
        enhancedProjects.push(project); // Keep as-is if no description
      }
    }

    return enhancedProjects;
  } catch (error) {
    console.error("Error enhancing projects list:", error);
    return projectsList; // Return original on error
  }
};

/**
 * Optimize skills selection (ensure most relevant skills within 3-skill limit)
 */
export const optimizeSkills = async (skillsList, jobTitle) => {
  try {
    if (!skillsList || skillsList.length <= 3) {
      return skillsList; // Already within limit or empty
    }

    // If more than 3 skills, select the most relevant ones
    // For now, keep the first 3 with highest ratings
    const sortedSkills = skillsList
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);

    return sortedSkills;
  } catch (error) {
    console.error("Error optimizing skills:", error);
    return skillsList.slice(0, 3); // Fallback to first 3
  }
};

/**
 * Main function to automatically enhance all resume sections
 */
export const autoEnhanceResumeData = async (resumeData, resumeId, onProgress) => {
  const enhancementResults = {
    summary: { success: false, error: null },
    experience: { success: false, error: null },
    education: { success: false, error: null },
    projects: { success: false, error: null },
    skills: { success: false, error: null }
  };

  try {
    console.log("Starting automatic AI enhancement for resume:", resumeId);

    const enhancedData = { ...resumeData };
    const totalSteps = 5; // Summary, Experience, Education, Projects, Skills
    let currentStep = 0;

    // Helper function to update progress
    const updateProgress = (stepName, progress) => {
      currentStep++;
      const overallProgress = Math.min((currentStep / totalSteps) * 100, 100); // Cap at 100%
      if (onProgress) {
        onProgress(stepName, progress, overallProgress);
      }
    };

    // 1. Enhance Summary
    updateProgress("Enhancing summary...", 0);
    if (enhancedData.summary) {
      try {
        enhancedData.summary = await enhanceSummary(enhancedData.summary, enhancedData.jobTitle);
        enhancementResults.summary.success = true;
        updateProgress("Summary enhanced", 100);
      } catch (error) {
        console.error("Summary enhancement failed:", error);
        enhancementResults.summary.error = error.message;
        updateProgress("Summary enhancement failed (using original)", 100);
      }
    } else {
      updateProgress("No summary to enhance", 100);
    }

    // 2. Enhance Experience
    updateProgress("Enhancing experience...", 0);
    if (enhancedData.experience && enhancedData.experience.length > 0) {
      try {
        enhancedData.experience = await enhanceExperience(enhancedData.experience);
        enhancementResults.experience.success = true;
        updateProgress("Experience enhanced", 100);
      } catch (error) {
        console.error("Experience enhancement failed:", error);
        enhancementResults.experience.error = error.message;
        updateProgress("Experience enhancement failed (using original)", 100);
      }
    } else {
      updateProgress("No experience to enhance", 100);
    }

    // 3. Enhance Education
    updateProgress("Enhancing education...", 0);
    if (enhancedData.education && enhancedData.education.length > 0) {
      try {
        enhancedData.education = await enhanceEducation(enhancedData.education);
        enhancementResults.education.success = true;
        updateProgress("Education enhanced", 100);
      } catch (error) {
        console.error("Education enhancement failed:", error);
        enhancementResults.education.error = error.message;
        updateProgress("Education enhancement failed (using original)", 100);
      }
    } else {
      updateProgress("No education to enhance", 100);
    }

    // 4. Enhance Projects
    updateProgress("Enhancing projects...", 0);
    if (enhancedData.projects && enhancedData.projects.length > 0) {
      try {
        enhancedData.projects = await enhanceProjects(enhancedData.projects);
        enhancementResults.projects.success = true;
        updateProgress("Projects enhanced", 100);
      } catch (error) {
        console.error("Projects enhancement failed:", error);
        enhancementResults.projects.error = error.message;
        updateProgress("Projects enhancement failed (using original)", 100);
      }
    } else {
      updateProgress("No projects to enhance", 100);
    }

    // 5. Optimize Skills
    updateProgress("Optimizing skills...", 0);
    if (enhancedData.skills && enhancedData.skills.length > 0) {
      try {
        enhancedData.skills = await optimizeSkills(enhancedData.skills, enhancedData.jobTitle);
        enhancementResults.skills.success = true;
        updateProgress("Skills optimized", 100);
      } catch (error) {
        console.error("Skills optimization failed:", error);
        enhancementResults.skills.error = error.message;
        updateProgress("Skills optimization failed (using original)", 100);
      }
    } else {
      updateProgress("No skills to optimize", 100);
    }

    // Save enhanced data to backend
    updateProgress("Saving enhanced resume...", 0);

    // Only send the fields that should be updated, exclude MongoDB metadata
    const cleanedData = {
      summary: enhancedData.summary,
      experience: enhancedData.experience,
      education: enhancedData.education,
      projects: enhancedData.projects,
      skills: enhancedData.skills,
      certifications: enhancedData.certifications,
      educationTraining: enhancedData.educationTraining
    };

    const saveData = { data: cleanedData };
    const response = await updateThisResume(resumeId, saveData);
    updateProgress("Resume saved successfully", 100);

    // Count successful enhancements
    const successCount = Object.values(enhancementResults).filter(result => result.success).length;
    const totalSections = Object.keys(enhancementResults).length;

    console.log("Automatic AI enhancement completed");
    console.log("Enhancement results:", enhancementResults);

    let message = "";
    if (successCount === totalSections) {
      message = "Resume automatically enhanced with AI! All sections improved successfully.";
    } else if (successCount > 0) {
      message = `Resume enhanced with AI! ${successCount} out of ${totalSections} sections improved successfully.`;
    } else {
      message = "Resume uploaded successfully. AI enhancement encountered issues, but your original content is preserved.";
    }

    return {
      success: true,
      enhancedData: response.data || enhancedData,
      enhancementResults,
      successCount,
      totalSections,
      message
    };

  } catch (error) {
    console.error("Error in automatic enhancement:", error);

    // If saving fails, still return the enhanced data
    const successCount = Object.values(enhancementResults).filter(result => result.success).length;

    if (successCount > 0) {
      // Some enhancements succeeded, but saving failed
      throw new Error(`AI enhancement partially completed (${successCount} sections), but failed to save. Please try uploading again.`);
    } else {
      // No enhancements succeeded
      throw new Error(error.message || "Failed to enhance resume automatically");
    }
  }
};
