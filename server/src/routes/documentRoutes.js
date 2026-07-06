import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadDocument,
  getDocuments,
  removeDocument,
} from "../controllers/documentController.js";

const router = express.Router();

// Upload PDF
router.post("/upload", authMiddleware, upload.single("file"), uploadDocument);

// List all documents in workspace
router.get("/workspace/:workspaceId", authMiddleware, getDocuments);

// Delete document
router.delete("/:documentId", authMiddleware, removeDocument);

export default router;
