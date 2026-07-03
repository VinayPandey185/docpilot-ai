import { generateEmbeddings } from "../services/ai/embeddingService.js";
import { retrieveRelevantChunks } from "../services/ai/retrievalService.js";
import { askGroq } from "../services/ai/groqService.js";

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

    const answer = await askGroq(question, chunks);

    return res.json({
      success: true,
      answer,
      sources: chunks.map((chunk) => ({
        similarity: chunk.similarity,
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
