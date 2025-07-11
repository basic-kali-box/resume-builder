import React from "react";
import { useState, useRef } from "react";
import { CopyPlus, Loader, Upload, FileText, AlertCircle, Sparkles, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume, createResumeFromUpload } from "@/Services/resumeAPI";
import { autoEnhanceResumeData } from "@/services/autoEnhancementService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTrial } from "@/context/TrialContext";
import { TrialBadge } from "@/components/custom/TrialCounter";

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [creationMode, setCreationMode] = useState("blank"); // "blank" or "upload"
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [enhancementLoading, setEnhancementLoading] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const [enhancementStep, setEnhancementStep] = useState("");
  const fileInputRef = useRef(null);
  const Navigate = useNavigate();

  // Trial context
  const { canUseAI, handleTrialExhaustion } = useTrial();

  const createResume = async () => {
    setLoading(true);
    if (resumetitle === "") {
      toast.error("Please add a title to your resume");
      setLoading(false);
      return;
    }

    const data = {
      data: {
        title: resumetitle,
        themeColor: "#000000",
      },
    };

    console.log(`Creating Resume ${resumetitle}`);
    try {
      const res = await createNewResume(data);
      console.log("Creating Resume Response:", res);
      toast.success("Resume created successfully!");
      setOpenDialog(false);
      Navigate(`/dashboard/edit-resume/${res.data.resume._id}`);
    } catch (error) {
      console.error("Error creating resume:", error);
      toast.error("Failed to create resume. Please try again.");
    } finally {
      setLoading(false);
      setResumetitle("");
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload only PDF or DOCX files");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      console.log("File selected:", file.name, file.type, file.size);
    }
  };

  const uploadAndCreateResume = async () => {
    // Check trial availability first for AI extraction
    if (!canUseAI()) {
      handleTrialExhaustion();
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!resumetitle.trim()) {
      toast.error("Please add a title to your resume");
      return;
    }

    setUploadLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("resumeFile", selectedFile);
      formData.append("title", resumetitle);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await createResumeFromUpload(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);
      console.log("Upload and extraction result:", result);

      // Check if extraction was successful and has content to enhance
      const extractedData = result.data.resume;
      const hasContentToEnhance = extractedData.summary ||
        (extractedData.experience && extractedData.experience.length > 0) ||
        (extractedData.education && extractedData.education.length > 0) ||
        (extractedData.projects && extractedData.projects.length > 0);

      if (hasContentToEnhance) {
        // Start automatic AI enhancement
        setEnhancementLoading(true);
        setEnhancementProgress(0);
        setEnhancementStep("Starting AI enhancement...");

        try {
          const enhancementResult = await autoEnhanceResumeData(
            extractedData,
            extractedData._id,
            (stepName, stepProgress, overallProgress) => {
              setEnhancementStep(stepName);
              setEnhancementProgress(Math.min(overallProgress, 100)); // Cap at 100%
            }
          );

          toast.success("Resume uploaded, extracted, and enhanced with AI successfully!");
          console.log("Enhancement completed:", enhancementResult);
        } catch (enhancementError) {
          console.error("Enhancement failed:", enhancementError);
          toast.warning("Resume uploaded successfully, but AI enhancement failed. You can enhance sections manually.");
        } finally {
          setEnhancementLoading(false);
          setEnhancementProgress(0);
          setEnhancementStep("");
        }
      } else {
        toast.success("Resume uploaded and processed successfully!");
      }

      setOpenDialog(false);
      Navigate(`/dashboard/edit-resume/${extractedData._id}`);

    } catch (uploadError) {
      console.error("Error uploading resume:", uploadError);

      // Check if it's an AI service issue
      if (uploadError.message.includes("AI resume processing is temporarily unavailable") ||
          uploadError.message.includes("Resume processing is currently unavailable") ||
          uploadError.message.includes("AI service is currently experiencing")) {
        toast.error(uploadError.message, {
          duration: 6000,
          action: {
            label: "Create Manually",
            onClick: () => {
              setCreationMode("blank");
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }
          }
        });
      } else {
        toast.error(uploadError.message || "Failed to upload and process resume");
      }

    } finally {
      setUploadLoading(false);
      setUploadProgress(0);
      // Always reset form on completion (success or error)
      setSelectedFile(null);
      setResumetitle("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const resetDialog = () => {
    setCreationMode("blank");
    setSelectedFile(null);
    setResumetitle("");
    setUploadProgress(0);
    setEnhancementLoading(false);
    setEnhancementProgress(0);
    setEnhancementStep("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <>
      <div
        className="dashboard-card-compact border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 hover:border-blue-400 transition-all duration-300 cursor-pointer group text-center"
        onClick={() => setOpenDialog(true)}
        data-create-resume
      >
        <div className="flex flex-col items-center justify-center py-4">
          <div className="icon-container-lg bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 group-hover:scale-110 transition-transform duration-300 mb-4">
            <CopyPlus className="w-8 h-8" />
          </div>
          <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-1">
            Create New Resume
          </h4>
          <p className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
            Start building your career story
          </p>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setOpenDialog(open);
        if (!open) resetDialog();
      }}>
        <DialogContent className="max-w-lg mx-4 sm:mx-auto">
          <DialogHeader className="text-center">
            <div className="icon-container-lg bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 mx-auto mb-4">
              <CopyPlus className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create a New Resume
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600 mt-2">
              Choose how you'd like to create your professional resume
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Creation Mode Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setCreationMode("blank")}
                className={`dashboard-card-compact border-2 transition-all duration-300 group ${
                  creationMode === "blank"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="text-center py-2">
                  <div className={`icon-container mx-auto mb-3 transition-all duration-300 ${
                    creationMode === "blank"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                  }`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Create Manually</p>
                  <p className="text-xs text-gray-500 mt-1">Start from scratch</p>
                </div>
              </button>

              <button
                onClick={() => setCreationMode("upload")}
                className={`dashboard-card-compact border-2 transition-all duration-300 group ${
                  creationMode === "upload"
                    ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <div className="text-center py-2">
                  <div className={`icon-container mx-auto mb-3 transition-all duration-300 ${
                    creationMode === "upload"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600"
                  }`}>
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Upload & Extract</p>
                  <p className="text-xs text-gray-500 mt-1">AI-powered extraction</p>
                  <div className="flex items-center justify-center mt-2">
                    <TrialBadge />
                  </div>
                </div>
              </button>
            </div>

            {/* Resume Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <div className="icon-container-sm bg-gray-100 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-.707.293H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                  </svg>
                </div>
                Resume Title
              </label>
              <Input
                type="text"
                placeholder="Ex: Backend Developer Resume"
                value={resumetitle}
                onChange={(e) => setResumetitle(e.target.value.trimStart())}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            {/* File Upload Section (only show when upload mode is selected) */}
            {creationMode === "upload" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">
                  Upload Resume File
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : "Click to upload PDF or DOCX"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Max size: 10MB</p>
                  </label>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded border">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">{selectedFile.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                )}

                {uploadLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing with AI...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Extracting and structuring your resume data...
                    </p>
                  </div>
                )}

                {enhancementLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        Enhancing with AI...
                      </span>
                      <span>{Math.round(enhancementProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enhancementProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {enhancementStep || "Preparing AI enhancement..."}
                    </p>
                  </div>
                )}

                {/* Upload Info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gray-600">
                      <p className="font-medium mb-1">AI will extract:</p>
                      <ul className="space-y-0.5 text-gray-500">
                        <li>• Personal details and contact info</li>
                        <li>• Work experience and job descriptions</li>
                        <li>• Education and qualifications</li>
                        <li>• Skills and projects</li>
                        <li>• Professional summary</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpenDialog(false);
                  resetDialog();
                }}
                disabled={loading || uploadLoading || enhancementLoading}
              >
                Cancel
              </Button>

              {creationMode === "blank" ? (
                <Button
                  onClick={createResume}
                  disabled={!resumetitle.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Start Building
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={uploadAndCreateResume}
                    disabled={!resumetitle.trim() || !selectedFile || uploadLoading || enhancementLoading || !canUseAI()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {uploadLoading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : enhancementLoading ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Extract with AI
                      </>
                    )}
                  </Button>
                  <TrialBadge />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;
