import supabase from "../../config/supabase.js";

export const retrieveRelevantChunks = async (
  workspaceId,
  embedding,
  limit = 5,
) => {
  const { data, error } = await supabase.rpc("match_document_chunks", {
    query_embedding: embedding,
    workspace: workspaceId,
    match_count: limit,
  });

  if (error) throw error;

  return data;
};
