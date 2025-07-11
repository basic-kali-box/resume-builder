import { Router } from "express";
import {
  enhanceContent,
  batchEnhanceContent,
  getAIStatus
} from "../controller/ai.controller.js";
import { isUserAvailable } from "../middleware/auth.js";
import { consumeTrialMiddleware } from "../middleware/trial.js";

const router = Router();

// AI Enhancement endpoints with trial restrictions
router.post("/enhance", isUserAvailable, consumeTrialMiddleware("AI Content Enhancement"), enhanceContent);
router.post("/batch-enhance", isUserAvailable, consumeTrialMiddleware("AI Batch Enhancement"), batchEnhanceContent);
router.get("/status", getAIStatus); // No auth required for status check

export default router;
