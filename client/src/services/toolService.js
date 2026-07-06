import api from "./api";

export const getToolLogs = async (workspaceId) => {
  const { data } = await api.get(`/tools/logs/${workspaceId}`);

  return data.data;
};
