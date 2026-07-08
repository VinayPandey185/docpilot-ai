import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import UploadCard from "../components/document/UploadCard";
import DocumentList from "../components/document/DocumentList";

import ToolLogs from "../components/tools/ToolLogs";

import ChatWindow from "../components/chat/ChatWindow";

import { useWorkspace } from "../context/WorkspaceContext";

export default function Dashboard() {
  const { activeWorkspace, loading: workspaceLoading } = useWorkspace();
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f8fafc",
          overflowY: "auto",
        }}
      >
        <Header />

        <div
          style={{
            padding: "25px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {workspaceLoading ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 50,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              }}
            >
              <h2>Loading workspace...</h2>
            </div>
          ) : !activeWorkspace ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 50,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              }}
            >
              <h2
                style={{
                  marginBottom: 15,
                }}
              >
                📂 No Workspace Available
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: 16,
                }}
              >
                Create your first workspace from the left sidebar to start
                uploading documents and chatting with AI.
              </p>
            </div>
          ) : (
            <>
              <UploadCard />

              <DocumentList />

              <ToolLogs />

              <ChatWindow />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
