import supabase from "../config/supabase.js";

export const chunkText = (text, chunkSize = 1000, overlap = 200) => {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));

    start += chunkSize - overlap;
  }

  return chunks;
};

export const saveChunks = async ({
  workspaceId,
  documentId,
  chunks,
  embeddings,
}) => {
  const rows = chunks.map((chunk, index) => ({
    workspace_id: workspaceId,
    document_id: documentId,
    chunk_number: index + 1,
    chunk_text: chunk,
    embedding: embeddings[index],
  }));

  const { error } = await supabase.from("document_chunks").insert(rows);

  if (error) throw error;
};
