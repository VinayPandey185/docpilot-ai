import { extractPdfText } from "../services/documentService.js";
import { chunkText } from "../services/chunkService.js";
import { generateEmbeddings } from "../services/ai/embeddingService.js";
import {
  findDuplicateDocument,
  saveDocument,
  saveChunks,
} from "../services/vectorService.js";
import { generateFileHash } from "../utils/hashFile.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const workspaceId = req.body.workspaceId;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "workspaceId is required",
      });
    }

    // Generate file hash
    const fileHash = generateFileHash(req.file.path);

    // Check duplicate
    const duplicate = await findDuplicateDocument(workspaceId, fileHash);

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Document already exists in this workspace.",
      });
    }

    // Extract PDF text
    const text = await extractPdfText(req.file.path);

    // Split into chunks
    const chunks = chunkText(text);

    // Generate embeddings
    const embeddings = await generateEmbeddings(chunks);

    // Save document metadata
    const document = await saveDocument({
      workspaceId,
      filename: req.file.originalname,
      fileHash,
    });

    // Save chunks + embeddings
    await saveChunks({
      workspaceId,
      documentId: document.id,
      chunks,
      embeddings,
    });

    return res.status(201).json({
      success: true,
      documentId: document.id,
      filename: document.filename,
      totalChunks: chunks.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
