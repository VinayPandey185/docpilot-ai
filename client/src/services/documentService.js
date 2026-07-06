import api from "./api";

export const uploadDocument = async (file, workspaceId) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("workspaceId", workspaceId);

  const { data } = await api.post("/documents/upload", formData);

  return data;
};

export const getDocuments = async (workspaceId) => {
  const { data } = await api.get(`/documents/workspace/${workspaceId}`);

  return data.documents;
};

export const deleteDocument = async (documentId) => {
  const { data } = await api.delete(`/documents/${documentId}`);

  return data;
};
