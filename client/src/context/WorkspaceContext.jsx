import { createContext, useContext, useEffect, useState } from "react";
import { createWorkspace, getWorkspaces } from "../services/workspaceService";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toolLogsVersion, setToolLogsVersion] = useState(0);

  const refreshToolLogs = () => {
    setToolLogsVersion((prev) => prev + 1);
  };

  // Used to refresh document list without reloading the page
  const [documentVersion, setDocumentVersion] = useState(0);

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
      console.error(error);
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

  // Refresh documents without reloading the browser
  const refreshDocuments = () => {
    setDocumentVersion((prev) => prev + 1);
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
