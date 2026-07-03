import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { uploadDocument } from "../controllers/documentController.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadDocument);

export default router;
