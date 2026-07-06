import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { fetchToolLogs } from "../controllers/toolController.js";

const router = express.Router();

router.use(authMiddleware);

// Get tool logs for a workspace
router.get("/logs/:workspaceId", fetchToolLogs);

export default router;
