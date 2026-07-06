import { useEffect, useState } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { getToolLogs } from "../../services/toolService";

export default function ToolLogs() {
  const { activeWorkspace, toolLogsVersion } = useWorkspace();

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (activeWorkspace) {
      loadLogs();
    } else {
      setLogs([]);
    }
  }, [activeWorkspace, toolLogsVersion]);

  const loadLogs = async () => {
    try {
      const data = await getToolLogs(activeWorkspace.id);
      setLogs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getRelativeTime = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: 20,
        background: "#fff",
        borderRadius: 10,
        padding: 18,
        boxShadow: "0 2px 8px rgba(0,0,0,.1)",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: 6,
        }}
      >
        🛠 Recent Tool Calls
      </h3>

      <p
        style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: 13,
          marginBottom: 15,
        }}
      >
        Recent AI tool executions for this workspace.
      </p>

      {logs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#64748b",
            padding: 20,
          }}
        >
          No tool calls yet.
        </div>
      ) : (
        <div
          style={{
            maxHeight: 220,
            overflowY: "auto",
            paddingRight: 5,
          }}
        >
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: 12,
                marginBottom: 10,
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "#2563eb",
                  marginBottom: 8,
                }}
              >
                🛠{" "}
                {log.tool_name === "save_task"
                  ? "Save Task"
                  : log.tool_name === "list_tasks"
                    ? "List Tasks"
                    : log.tool_name}
              </div>

              {log.tool_name === "save_task" && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#475569",
                  }}
                >
                  📌 <strong>{log.arguments?.title}</strong>
                </div>
              )}

              {log.tool_name === "list_tasks" && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#475569",
                  }}
                >
                  📋 Retrieved <strong>{log.result?.length || 0}</strong>{" "}
                  task(s)
                </div>
              )}

              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "#94a3b8",
                }}
              >
                ⏰ {getRelativeTime(log.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
