import { extractPdfText } from "../services/documentService.js";
import { chunkText } from "../services/chunkService.js";
import { generateEmbeddings } from "../services/ai/embeddingService.js";
import {
  findDuplicateDocument,
  saveDocument,
  saveChunks,
  getDocumentsByWorkspace,
  deleteDocument,
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

    const fileHash = generateFileHash(req.file.path);

    const duplicate = await findDuplicateDocument(workspaceId, fileHash);

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Document already exists in this workspace.",
      });
    }

    const text = await extractPdfText(req.file.path);

    const chunks = chunkText(text);

    const embeddings = await generateEmbeddings(chunks);

    const document = await saveDocument({
      workspaceId,
      filename: req.file.originalname,
      fileHash,
    });

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

export const getDocuments = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const documents = await getDocumentsByWorkspace(workspaceId);

    return res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    await deleteDocument(documentId);

    return res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
