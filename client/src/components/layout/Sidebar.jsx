import { useState } from "react";
import toast from "react-hot-toast";

import { useWorkspace } from "../../context/WorkspaceContext";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const {
    workspaces,
    activeWorkspace,
    loading: workspaceLoading,
    selectWorkspace,
    addWorkspace,
    removeWorkspace,
  } = useWorkspace();

  const { user, logout } = useAuth();

  const [workspaceName, setWorkspaceName] = useState("");
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast.error("Please enter a workspace name.");
      return;
    }

    try {
      setCreatingWorkspace(true);

      await addWorkspace(workspaceName.trim());

      toast.success("Workspace created successfully.");

      setWorkspaceName("");
    } catch (err) {
      toast.error(err.message || "Failed to create workspace");
    } finally {
      setCreatingWorkspace(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    const confirmed = window.confirm(
      "Delete this workspace?\n\nAll documents, chats, tasks and tool logs will also be deleted.",
    );

    if (!confirmed) return;

    try {
      await removeWorkspace(workspaceId);

      toast.success("Workspace deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete workspace.");
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    await logout();
  };

  return (
    <div
      style={{
        width: 300,
        height: "100vh",
        background: "#0f172a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #1e293b",
        overflowY: "auto",
      }}
    >
      <div style={{ padding: 20 }}>
        {/* Logo */}

        <div style={{ marginBottom: 30 }}>
          <h2
            style={{
              margin: 0,
              color: "#60a5fa",
              fontWeight: 700,
            }}
          >
            📄 DocPilot AI
          </h2>

          <p
            style={{
              marginTop: 6,
              color: "#94a3b8",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            AI-Powered Workspace Assistant
          </p>
        </div>

        {/* User */}

        <div
          style={{
            background: "#1e293b",
            padding: 15,
            borderRadius: 10,
            marginBottom: 30,
            border: "1px solid #334155",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: 5,
            }}
          >
            👤 {user?.user_metadata?.full_name || "User"}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#cbd5e1",
              wordBreak: "break-word",
            }}
          >
            {user?.email}
          </div>

          <div
            style={{
              marginTop: 10,
              display: "inline-block",
              background: "#14532d",
              color: "#86efac",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            🟢 Online
          </div>
        </div>

        {/* Workspaces */}

        <h3
          style={{
            marginBottom: 15,
          }}
        >
          📂 Your Workspaces
        </h3>

        {workspaceLoading ? (
          <div
            style={{
              background: "#1e293b",
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              border: "1px solid #334155",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#cbd5e1",
                fontSize: 14,
              }}
            >
              Loading workspaces...
            </p>
          </div>
        ) : workspaces.length === 0 ? (
          <div
            style={{
              background: "#1e293b",
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              border: "1px solid #334155",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#cbd5e1",
                fontSize: 14,
              }}
            >
              No workspaces available.
            </p>

            <p
              style={{
                marginTop: 10,
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              Create your first workspace below.
            </p>
          </div>
        ) : (
          workspaces.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => selectWorkspace(workspace)}
              style={{
                padding: "12px 14px",
                marginBottom: 10,
                borderRadius: 10,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background:
                  activeWorkspace?.id === workspace.id ? "#2563eb" : "#1e293b",
                border:
                  activeWorkspace?.id === workspace.id
                    ? "1px solid #60a5fa"
                    : "1px solid transparent",
              }}
            >
              <span>🏢 {workspace.name}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteWorkspace(workspace.id);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f87171",
                  cursor: "pointer",
                  fontSize: 18,
                }}
                title="Delete Workspace"
              >
                🗑️
              </button>
            </div>
          ))
        )}

        {/* Create Workspace */}

        <div
          style={{
            marginTop: 30,
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 14,
              color: "#cbd5e1",
            }}
          >
            Create Workspace
          </label>

          <input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Workspace name..."
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleCreateWorkspace}
            disabled={creatingWorkspace}
            style={{
              width: "100%",
              marginTop: 12,
              padding: 11,
              border: "none",
              borderRadius: 8,
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {creatingWorkspace ? "Creating..." : "➕ Create Workspace"}
          </button>
        </div>
      </div>

      {/* Footer */}

      <div
        style={{
          padding: 20,
          borderTop: "1px solid #1e293b",
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          Powered by
          <br />
          <strong
            style={{
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            Groq • Hugging Face • Supabase
          </strong>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 15,
            transition: "0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#b91c1c";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#dc2626";
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
