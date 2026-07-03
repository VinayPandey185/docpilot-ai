import { createContext, useContext, useEffect, useState } from "react";
import { createWorkspace, getWorkspaces } from "../services/workspaceService";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await getWorkspaces();

      setWorkspaces(data);

      const savedWorkspaceId = localStorage.getItem("activeWorkspace");

      if (savedWorkspaceId) {
        const workspace = data.find((w) => w.id === savedWorkspaceId);

        if (workspace) {
          setActiveWorkspace(workspace);
          return;
        }
      }

      if (data.length > 0) {
        setActiveWorkspace(data[0]);
        localStorage.setItem("activeWorkspace", data[0].id);
      }
    } catch (error) {
      console.error("Failed to load workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkspace = async (name) => {
    try {
      const workspace = await createWorkspace(name);

      setWorkspaces((prev) => [...prev, workspace]);

      setActiveWorkspace(workspace);

      localStorage.setItem("activeWorkspace", workspace.id);
    } catch (error) {
      console.error("Failed to create workspace:", error);
    }
  };

  const selectWorkspace = (workspace) => {
    setActiveWorkspace(workspace);

    localStorage.setItem("activeWorkspace", workspace.id);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        loading,
        addWorkspace,
        selectWorkspace,
        loadWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);
