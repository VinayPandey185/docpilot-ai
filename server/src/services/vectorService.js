import supabase from "../config/supabase.js";

export const findDuplicateDocument = async (workspaceId, fileHash) => {
  const { data, error } = await supabase
    .from("documents")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("file_hash", fileHash)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const saveDocument = async ({ workspaceId, filename, fileHash }) => {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      workspace_id: workspaceId,
      filename,
      file_hash: fileHash,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
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

  return true;
};
