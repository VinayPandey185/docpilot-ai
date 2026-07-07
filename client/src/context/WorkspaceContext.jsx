import { createContext, useContext, useEffect, useState } from "react";
import { createWorkspace, getWorkspaces } from "../services/workspaceService";
import { useAuth } from "./AuthContext";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const { user } = useAuth();

  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  // Used to refresh Tool Logs without reloading the page
  const [toolLogsVersion, setToolLogsVersion] = useState(0);

  const refreshToolLogs = () => {
    setToolLogsVersion((prev) => prev + 1);
  };

  // Used to refresh Document List without reloading the page
  const [documentVersion, setDocumentVersion] = useState(0);

  const refreshDocuments = () => {
    setDocumentVersion((prev) => prev + 1);
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      loadWorkspaces();
    } else {
      // Clear workspace state when user logs out
      localStorage.removeItem("activeWorkspace");

      setWorkspaces([]);
      setActiveWorkspace(null);
      setSelectedDocument(null);
      setLoading(false);
    }
  }, [user]);

  const loadWorkspaces = async () => {
    try {
      const data = await getWorkspaces();

      setWorkspaces(data);

      const savedWorkspaceId = localStorage.getItem("activeWorkspace");

      if (savedWorkspaceId) {
        const workspace = data.find((w) => w.id === savedWorkspaceId);

        if (workspace) {
          setActiveWorkspace(workspace);
          setSelectedDocument(null);
          return;
        }
      }

      if (data.length > 0) {
        setActiveWorkspace(data[0]);
        setSelectedDocument(null);

        localStorage.setItem("activeWorkspace", data[0].id);
      } else {
        setActiveWorkspace(null);
        setSelectedDocument(null);
      }
    } catch (error) {
      console.error("Failed to load workspaces:", error);

      setWorkspaces([]);
      setActiveWorkspace(null);
      setSelectedDocument(null);
    } finally {
      setLoading(false);
    }
  };

  const addWorkspace = async (name) => {
    const workspace = await createWorkspace(name);

    setWorkspaces((prev) => [...prev, workspace]);

    setActiveWorkspace(workspace);
    setSelectedDocument(null);

    localStorage.setItem("activeWorkspace", workspace.id);
  };

  const selectWorkspace = (workspace) => {
    setActiveWorkspace(workspace);
    setSelectedDocument(null);

    localStorage.setItem("activeWorkspace", workspace.id);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        selectedDocument,
        setSelectedDocument,
        loading,
        addWorkspace,
        selectWorkspace,
        loadWorkspaces,
        documentVersion,
        refreshDocuments,
        toolLogsVersion,
        refreshToolLogs,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);
