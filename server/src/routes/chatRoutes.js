import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { askQuestion, getChatHistory } from "../controllers/chatController.js";

const router = express.Router();

router.use(authMiddleware);

// Chat with AI
router.post("/", askQuestion);

// Chat history for a workspace
router.get("/history/:workspaceId", getChatHistory);

export default router;
