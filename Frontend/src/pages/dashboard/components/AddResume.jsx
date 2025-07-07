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
import { createNewResume } from "@/Services/resumeAPI";
import { autoEnhanceResumeData } from "@/services/autoEnhancementService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

      const response = await fetch(`${import.meta.env.VITE_APP_URL}api/resumes/createResumeFromUpload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();

        // Pass through the specific error message from the backend
        // This preserves detailed error messages like PDF formatting issues
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();
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

    } catch (error) {
      console.error("Error uploading resume:", error);

      // Check if it's an AI service issue
      if (error.message.includes("AI resume processing is temporarily unavailable") ||
          error.message.includes("Resume processing is currently unavailable") ||
          error.message.includes("AI service is currently experiencing")) {
        toast.error(error.message, {
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
        toast.error(error.message || "Failed to upload and process resume");
      }
    } finally {
      setUploadLoading(false);
      setUploadProgress(0);
      if (!error?.message?.includes("AI")) {
        setSelectedFile(null);
        setResumetitle("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
        className="p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
        onClick={() => setOpenDialog(true)}
        data-create-resume
      >
        <CopyPlus className="text-3xl text-gray-400 group-hover:text-blue-500 transition-colors duration-300 mb-3" />
        <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
          Create New Resume
        </p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setOpenDialog(open);
        if (!open) resetDialog();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create a New Resume</DialogTitle>
            <DialogDescription>
              Choose how you'd like to create your resume
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Creation Mode Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCreationMode("blank")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  creationMode === "blank"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Create Manually</p>
              </button>

              <button
                onClick={() => setCreationMode("upload")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  creationMode === "upload"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Upload & Extract</p>
              </button>
            </div>

            {/* Resume Title Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Resume Title
              </label>
              <Input
                type="text"
                placeholder="Ex: Backend Developer Resume"
                value={resumetitle}
                onChange={(e) => setResumetitle(e.target.value.trimStart())}
                className="w-full"
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
                <Button
                  onClick={uploadAndCreateResume}
                  disabled={!resumetitle.trim() || !selectedFile || uploadLoading || enhancementLoading}
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
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;
