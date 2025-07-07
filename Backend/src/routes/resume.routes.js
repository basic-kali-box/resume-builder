import { Router } from "express";
import {
  start,
  createResume,
  createResumeFromUpload,
  getALLResume,
  getResume,
  updateResume,
  removeResume,
} from "../controller/resume.controller.js";
import { isUserAvailable } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/", start);
router.post("/createResume", isUserAvailable, createResume);
router.post("/createResumeFromUpload", isUserAvailable, upload.single("resumeFile"), createResumeFromUpload);
router.get("/getAllResume", isUserAvailable, getALLResume);
router.get("/getResume", isUserAvailable, getResume);
router.put("/updateResume", isUserAvailable, updateResume);
router.delete("/removeResume", isUserAvailable, removeResume);

export default router;
