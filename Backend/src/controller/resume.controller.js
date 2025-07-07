import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Resume from "../models/resume.model.js";
import { processResumeFile } from "../services/fileExtraction.service.js";

const start = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Welcome to Resume Builder API"));
};

const createResume = async (req, res) => {
  const { title, themeColor } = req.body;

  // Validate that the title and themeColor are provided
  if (!title || !themeColor) {
    return res
      .status(400)
      .json(new ApiError(400, "Title and themeColor are required."));
  }

  try {
    // Create a new resume with empty fields for other attributes
    const resume = await Resume.create({
      title,
      themeColor,
      user: req.user._id, // Set the user ID from the authenticated user
      firstName: "",
      lastName: "",
      email: "",
      summary: "",
      jobTitle: "",
      phone: "",
      address: "",
      experience: [],
      education: [], // Initialize as an empty array
      skills: [],
      projects: [],
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { resume }, "Resume created successfully"));
  } catch (error) {
    console.error("Error creating resume:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }
};

const getALLResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user });
    return res
      .status(200)
      .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

const getResume = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json(new ApiError(400, "Resume ID is required."));
    }

    // Find the resume by ID
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json(new ApiError(404, "Resume not found."));
    }

    // Check if the resume belongs to the current user
    if (resume.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          new ApiError(403, "You are not authorized to access this resume.")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, resume, "Resume fetched successfully"));
  } catch (error) {
    console.error("Error fetching resume:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

const updateResume = async (req, res) => {
  console.log("Resume update request received:");
  console.log("Request ID:", req.query.id);
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  const id = req.query.id;

  try {
    // Validate skills limit if skills are being updated
    if (req.body.skills && req.body.skills.length > 3) {
      return res
        .status(400)
        .json(new ApiError(400, "Maximum 3 skills allowed"));
    }

    // Find and update the resume with the provided ID and user ID
    console.log("Database update request started");

    // Build update object with only the fields that are being updated
    const updateObject = { $currentDate: { updatedAt: true } };

    // Only set fields that are actually present in the request body
    if (Object.keys(req.body).length > 0) {
      updateObject.$set = {};

      // Safely update only the fields that are provided
      Object.keys(req.body).forEach(key => {
        updateObject.$set[key] = req.body[key];
      });
    }

    console.log("Update object:", JSON.stringify(updateObject, null, 2));

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateObject,
      { new: true, runValidators: true } // Return the modified document and run validators
    );

    if (!updatedResume) {
      console.log("Resume not found or unauthorized");
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Resume not found or unauthorized"));
    }

    console.log("Resume updated successfully:");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedResume, "Resume updated successfully"));
  } catch (error) {
    console.error("Error updating resume:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }

  // return res.status(200).json({ message: "Hello World" });
};

const removeResume = async (req, res) => {
  const id = req.query.id;

  try {
    // Check if the resume exists and belongs to the current user
    const resume = await Resume.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            null,
            "Resume not found or not authorized to delete this resume"
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Resume deleted successfully"));
  } catch (error) {
    console.error("Error while deleting resume:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

const createResumeFromUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json(new ApiError(400, "No file uploaded. Please upload a PDF or DOCX file."));
    }

    const { title } = req.body;
    if (!title) {
      return res
        .status(400)
        .json(new ApiError(400, "Resume title is required."));
    }

    console.log("Processing uploaded file:", req.file.filename);
    console.log("File path:", req.file.path);
    console.log("File mimetype:", req.file.mimetype);

    // Process the uploaded file and extract data
    let extractionResult;
    try {
      extractionResult = await processResumeFile(req.file.path, req.file.mimetype);
    } catch (extractionError) {
      console.error("File extraction error:", extractionError);

      // Provide user-friendly error messages with guidance
      let userMessage = extractionError.message;
      let statusCode = 400;

      // Handle AI service issues specifically
      if (extractionError.message.includes("AI service is currently experiencing") ||
          extractionError.message.includes("overloaded") ||
          extractionError.message.includes("quota exceeded") ||
          extractionError.message.includes("Network error")) {
        statusCode = 503;
        userMessage = "AI resume processing is temporarily unavailable. Please try again in a few minutes, or create your resume manually using the 'Create New Resume' option.";
      } else if (extractionError.message.includes("AI extraction failed")) {
        statusCode = 503;
        userMessage = "Resume processing is currently unavailable. Please create your resume manually using the 'Create New Resume' option and add your information step by step.";
      }

      return res
        .status(statusCode)
        .json(new ApiError(statusCode, userMessage, [], {
          suggestion: "Use the 'Create New Resume' option to build your resume manually",
          canRetry: statusCode === 503
        }));
    }

    if (!extractionResult.success) {
      return res
        .status(500)
        .json(new ApiError(500, "Failed to extract data from the uploaded file."));
    }

    const { structuredData } = extractionResult;

    // Create resume with extracted data
    const resumeData = {
      title,
      themeColor: "#000000", // Default theme color
      user: req.user._id,
      // Personal details
      firstName: structuredData.personalDetails.firstName,
      lastName: structuredData.personalDetails.lastName,
      email: structuredData.personalDetails.email,
      phone: structuredData.personalDetails.phone,
      address: structuredData.personalDetails.address,
      jobTitle: structuredData.personalDetails.jobTitle,
      // Other sections
      summary: structuredData.summary,
      experience: structuredData.experience,
      education: structuredData.education,
      skills: structuredData.skills,
      projects: structuredData.projects,
    };

    const resume = await Resume.create(resumeData);

    return res
      .status(201)
      .json(new ApiResponse(201, {
        resume,
        extractedData: structuredData
      }, "Resume created successfully from uploaded file"));

  } catch (error) {
    console.error("Error creating resume from upload:", error);

    // Clean up file if it still exists
    if (req.file && req.file.path) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }

    return res
      .status(500)
      .json(new ApiError(500, error.message || "Internal Server Error", [error.message], error.stack));
  }
};

export {
  start,
  createResume,
  createResumeFromUpload,
  getALLResume,
  getResume,
  updateResume,
  removeResume,
};
