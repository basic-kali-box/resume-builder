import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import fs from "fs";
import { createHierarchicalChatSession } from "./hierarchicalAI.service.js";

// AI Prompt for resume extraction
const EXTRACTION_PROMPT = `
You are an expert resume parser. Extract structured data from the following resume text and return it in the exact JSON format specified below.

Resume Text:
{resumeText}

Please extract and return the data in this exact JSON structure:
{
  "personalDetails": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "address": "",
    "jobTitle": ""
  },
  "summary": "",
  "experience": [
    {
      "title": "",
      "companyName": "",
      "city": "",
      "state": "",
      "startDate": "",
      "endDate": "",
      "currentlyWorking": "",
      "workSummary": ""
    }
  ],
  "education": [
    {
      "universityName": "",
      "degree": "",
      "major": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": [
    {
      "name": "",
      "rating": 4
    }
  ],
  "projects": [
    {
      "projectName": "",
      "techStack": "",
      "projectSummary": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuingOrganization": "",
      "issueDate": "",
      "expirationDate": ""
    }
  ],
  "educationTraining": [
    {
      "courseName": "",
      "institution": "",
      "completionDate": "",
      "description": ""
    }
  ]
}

Instructions:
1. Extract all available information from the resume text
2. For dates, use format "MM/YYYY" or "YYYY" if only year is available
3. For skills rating, assign a number between 1-5 based on context or default to 4
4. IMPORTANT: Extract maximum 3 skills only - select the most important/relevant skills
5. Extract certifications including professional certifications, licenses, and credentials
6. Extract education/training including courses, workshops, bootcamps, and professional development
7. For certification dates, use "YYYY-MM" format if available
8. If information is not available, leave the field as empty string
9. For currentlyWorking in experience, use "Yes" if it's the current job, otherwise empty string
10. Ensure all arrays contain at least one object even if partially filled
11. Return only valid JSON, no additional text or explanations
`;

/**
 * Extract text from PDF file using pdfjs-dist (serverless-friendly)
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file not found");
    }

    const dataBuffer = fs.readFileSync(filePath);

    if (dataBuffer.length === 0) {
      throw new Error("PDF file is empty");
    }

    // Convert Buffer to Uint8Array for pdfjs-dist compatibility
    const uint8Array = new Uint8Array(dataBuffer);

    // Load PDF document using pdfjs-dist
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      verbosity: 0, // Suppress console output
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    // Extract text from each page (limit to 50 pages for performance)
    const maxPages = Math.min(pdf.numPages, 50);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine text items with spaces
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();

        if (pageText) {
          fullText += pageText + '\n';
        }
      } catch (pageError) {
        console.warn(`Error extracting text from page ${pageNum}:`, pageError.message);
        // Continue with other pages
      }
    }

    if (!fullText || fullText.trim().length === 0) {
      throw new Error("No readable text found in PDF. The file might be image-based or corrupted.");
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);

    // Handle specific PDF parsing errors
    if (error.message.includes("Invalid PDF") ||
        error.message.includes("FormatError") ||
        error.message.includes("bad XRef")) {
      throw new Error("This PDF file has formatting issues that prevent text extraction. Please try uploading a DOCX file instead or save your PDF from a different application.");
    }

    if (error.message.includes("Password") || error.message.includes("encrypted")) {
      throw new Error("This PDF file is password-protected. Please upload an unprotected PDF file.");
    }

    if (error.message.includes("No readable text")) {
      throw new Error("No readable text found in PDF. The file might be image-based. Please try uploading a text-based PDF or DOCX file.");
    }

    throw new Error(error.message || "Failed to extract text from PDF file");
  }
};

/**
 * Extract text from DOCX file
 */
export const extractTextFromDOCX = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("DOCX file not found");
    }

    const result = await mammoth.extractRawText({ path: filePath });

    if (!result.value || result.value.trim().length === 0) {
      throw new Error("No readable text found in DOCX file. The file might be empty or corrupted.");
    }

    return result.value;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    if (error.message.includes("not a valid zip file")) {
      throw new Error("Invalid DOCX file. Please ensure the file is not corrupted.");
    }
    throw new Error(error.message || "Failed to extract text from DOCX file");
  }
};



/**
 * Extract structured data from resume text using AI with hierarchical fallback
 */
export const extractResumeDataWithAI = async (resumeText) => {
  try {
    const prompt = EXTRACTION_PROMPT.replace("{resumeText}", resumeText);

    console.log("🚀 Starting AI resume extraction with hierarchical fallback system...");

    // Use hierarchical AI service with built-in retry and fallback logic
    const chatSession = createHierarchicalChatSession();
    const result = await chatSession.sendMessage(prompt);

    const responseText = result.response.text();

    console.log("Raw AI Response:", responseText);

    // Parse the JSON response (handle markdown code blocks)
    let extractedData;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      extractedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", responseText);
      throw new Error("AI returned invalid JSON format");
    }

    // Validate and clean the extracted data
    const cleanedData = validateAndCleanExtractedData(extractedData);

    console.log("Successfully extracted resume data:", cleanedData);
    return cleanedData;
  } catch (error) {
    console.error("Error in AI extraction:", error);

    // Provide specific error messages for different failure types
    if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
      throw new Error("Invalid Gemini API key. Please check your API key configuration.");
    }

    if (error.message.includes("quota") || error.message.includes("rate limit")) {
      throw new Error("Gemini API quota exceeded. Please try again later or contact support.");
    }

    if (error.status === 503 || error.message.includes("overloaded")) {
      throw new Error("AI resume processing is temporarily unavailable due to high demand. Please try again in a few minutes, or use the 'Create New Resume' option to build your resume manually with our step-by-step builder.");
    }

    if (error.message.includes("network") || error.message.includes("fetch")) {
      throw new Error("Network error connecting to AI service. Please check your internet connection and try again.");
    }

    if (error.message.includes("JSON")) {
      throw new Error("AI response format error. The resume content may be too complex to parse. Please try simplifying your resume or contact support.");
    }

    // Generic error for other cases
    throw new Error(`AI extraction failed: ${error.message}. Please try again later or use the 'Create New Resume' option to build your resume manually with our guided builder.`);
  }
};



/**
 * Validate and clean extracted data
 */
const validateAndCleanExtractedData = (data) => {
  const cleaned = {
    personalDetails: {
      firstName: data.personalDetails?.firstName || "",
      lastName: data.personalDetails?.lastName || "",
      email: data.personalDetails?.email || "",
      phone: data.personalDetails?.phone || "",
      address: data.personalDetails?.address || "",
      jobTitle: data.personalDetails?.jobTitle || "",
    },
    summary: data.summary || "",
    experience: Array.isArray(data.experience) ? data.experience.map(exp => ({
      title: exp.title || "",
      companyName: exp.companyName || "",
      city: exp.city || "",
      state: exp.state || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      currentlyWorking: exp.currentlyWorking || "",
      workSummary: exp.workSummary || "",
    })) : [],
    education: Array.isArray(data.education) ? data.education.map(edu => ({
      universityName: edu.universityName || "",
      degree: edu.degree || "",
      major: edu.major || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      description: edu.description || "",
    })) : [],
    skills: Array.isArray(data.skills) ? data.skills.slice(0, 3).map(skill => ({
      name: skill.name || "",
      rating: typeof skill.rating === 'number' ? Math.min(Math.max(skill.rating, 1), 5) : 4,
    })) : [],
    projects: Array.isArray(data.projects) ? data.projects.map(project => ({
      projectName: project.projectName || "",
      techStack: project.techStack || "",
      projectSummary: project.projectSummary || "",
    })) : [],
    certifications: Array.isArray(data.certifications) ? data.certifications.map(cert => ({
      name: cert.name || "",
      issuingOrganization: cert.issuingOrganization || "",
      issueDate: cert.issueDate || "",
      expirationDate: cert.expirationDate || "",
    })) : [],
    educationTraining: Array.isArray(data.educationTraining) ? data.educationTraining.map(training => ({
      courseName: training.courseName || "",
      institution: training.institution || "",
      completionDate: training.completionDate || "",
      description: training.description || "",
    })) : [],
  };

  // Ensure at least one empty object in arrays if they're empty
  if (cleaned.experience.length === 0) {
    cleaned.experience.push({
      title: "", companyName: "", city: "", state: "",
      startDate: "", endDate: "", currentlyWorking: "", workSummary: ""
    });
  }
  
  if (cleaned.education.length === 0) {
    cleaned.education.push({
      universityName: "", degree: "", major: "",
      startDate: "", endDate: "", description: ""
    });
  }

  if (cleaned.certifications.length === 0) {
    cleaned.certifications.push({
      name: "", issuingOrganization: "", issueDate: "", expirationDate: ""
    });
  }

  if (cleaned.educationTraining.length === 0) {
    cleaned.educationTraining.push({
      courseName: "", institution: "", completionDate: "", description: ""
    });
  }

  return cleaned;
};



/**
 * Main function to process uploaded resume file
 */
export const processResumeFile = async (filePath, mimeType) => {
  try {
    let extractedText = "";

    // Extract text based on file type
    if (mimeType === "application/pdf") {
      extractedText = await extractTextFromPDF(filePath);
    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      extractedText = await extractTextFromDOCX(filePath);
    } else {
      throw new Error("Unsupported file type. Please upload PDF or DOCX files only.");
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text could be extracted from the file. Please ensure the file contains readable text.");
    }

    console.log("Extracted text length:", extractedText.length);
    console.log("Extracted text preview:", extractedText.substring(0, 500));

    // Use AI to extract structured data (no fallback)
    const structuredData = await extractResumeDataWithAI(extractedText);

    return {
      success: true,
      extractedText,
      structuredData,
    };
  } catch (error) {
    console.error("Error processing resume file:", error);
    throw error;
  } finally {
    // Clean up uploaded file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Temporary file cleaned up:", filePath);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up file:", cleanupError);
    }
  }
};
