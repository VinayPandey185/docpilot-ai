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

    // Select the most relevant source document
    const sortedChunks = [...chunks].sort(
      (a, b) => b.similarity - a.similarity,
    );

    const topChunk = sortedChunks[0];

    // Don't show sources when the AI couldn't answer
    const normalizedAnswer = answer.toLowerCase();

    const noAnswer =
      normalizedAnswer.includes("couldn't find") ||
      normalizedAnswer.includes("could not find") ||
      normalizedAnswer.includes("not found") ||
      normalizedAnswer.includes("don't have information") ||
      normalizedAnswer.includes("do not have information") ||
      normalizedAnswer.includes("no relevant information");

    const uniqueSources =
      !noAnswer && topChunk
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
