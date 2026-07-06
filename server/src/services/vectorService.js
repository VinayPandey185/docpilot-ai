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

export const getDocumentsByWorkspace = async (workspaceId) => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("uploaded_at", { ascending: false });

  if (error) throw error;

  return data;
};

export const deleteDocument = async (documentId) => {
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (error) throw error;

  return true;
};

export const saveChatHistory = async ({
  workspaceId,
  userId,
  question,
  answer,
}) => {
  const { error } = await supabase.from("chat_history").insert({
    workspace_id: workspaceId,
    user_id: userId,
    question,
    answer,
  });

  if (error) throw error;

  return true;
};

export const getChatHistoryByWorkspace = async (workspaceId) => {
  const { data, error } = await supabase
    .from("chat_history")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
};
