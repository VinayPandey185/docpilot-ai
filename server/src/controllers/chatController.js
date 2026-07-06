import { generateEmbeddings } from "../services/ai/embeddingService.js";
import { retrieveRelevantChunks } from "../services/ai/retrievalService.js";
import { runAgent } from "../services/ai/agentService.js";

import {
  saveChatHistory,
  getChatHistoryByWorkspace,
} from "../services/vectorService.js";

export const askQuestion = async (req, res) => {
  try {
    const { question, workspaceId } = req.body;

    if (!question || !workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Question and workspaceId are required",
      });
    }

    const embedding = await generateEmbeddings([question]);

    const chunks = await retrieveRelevantChunks(workspaceId, embedding[0]);

    const answer = await runAgent({
      workspaceId,
      question,
      chunks,
    });
    await saveChatHistory({
      workspaceId,
      userId: req.user.id,
      question,
      answer,
    });

    // Remove duplicate source documents
    const sortedChunks = [...chunks].sort(
      (a, b) => b.similarity - a.similarity,
    );

    const topChunk = sortedChunks[0];

    const uniqueSources = topChunk
      ? [
          {
            filename: topChunk.filename,
            pageNumber: topChunk.page_number,
          },
        ]
      : [];

    return res.json({
      success: true,
      answer,
      sources: uniqueSources,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const history = await getChatHistoryByWorkspace(workspaceId);

    return res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
