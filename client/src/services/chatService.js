import api from "./api";

export const askQuestion = async (workspaceId, question) => {
  const { data } = await api.post("/chat", {
    workspaceId,
    question,
  });

  return data;
};

export const getChatHistory = async (workspaceId) => {
  const { data } = await api.get(`/chat/history/${workspaceId}`);

  return data.data;
};
