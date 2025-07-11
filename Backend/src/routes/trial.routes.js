import { Router } from "express";
import { 
  getCurrentTrialStatus, 
  resetUserTrials, 
  updateUserTrialLimit, 
  getTrialStats 
} from "../controller/trial.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

// Trial status endpoints
router.get("/status", isUserAvailable, getCurrentTrialStatus);
router.post("/reset", isUserAvailable, resetUserTrials); // Admin function
router.put("/limit", isUserAvailable, updateUserTrialLimit); // Admin function
router.get("/statistics", getTrialStats); // Admin function - no auth for now

export default router;
