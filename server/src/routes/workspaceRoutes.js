import express from "express";
import {
  createWorkspace,
  getWorkspaces,
} from "../controllers/workspaceController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createWorkspace);
router.get("/", getWorkspaces);

export default router;
