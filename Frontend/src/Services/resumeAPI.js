import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

// Determine the base URL based on environment
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return "/api/";
  }
  return (VITE_APP_URL || "http://localhost:5001/") + "api/";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const createNewResume = async (data) => {
  try {
    const response = await axiosInstance.post(
      "resumes/createResume",
      data.data
    );
    return response.data;
  } catch (error) {
    // console.log("Eroor in getting all the resumes ",error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getAllResumeData = async () => {
  try {
    const response = await axiosInstance.get("resumes/getAllResume");
    return response.data;
  } catch (error) {
    // console.log("Eroor in getting all the resumes ",error);
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getResumeData = async (resumeID) => {
  try {
    const response = await axiosInstance.get(
      `resumes/getResume?id=${resumeID}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const updateThisResume = async (resumeID, data) => {
  try {
    const response = await axiosInstance.put(
      `resumes/updateResume?id=${resumeID}`,
      data.data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const deleteThisResume = async (resumeID) => {
  try {
    const response = await axiosInstance.delete(
      `resumes/removeResume?id=${resumeID}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const createResumeFromUpload = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "resumes/createResumeFromUpload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

export {
  getAllResumeData,
  deleteThisResume,
  getResumeData,
  updateThisResume,
  createNewResume,
  createResumeFromUpload,
};
