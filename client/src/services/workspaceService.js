import api from "./api";

export const createWorkspace = async (name) => {
  const { data } = await api.post("/workspaces", {
    name,
  });

  return data.data;
};

export const getWorkspaces = async () => {
  const { data } = await api.get("/workspaces");

  return data.data;
};
