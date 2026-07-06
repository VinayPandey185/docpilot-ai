import { useWorkspace } from "../../context/WorkspaceContext";

export default function Header() {
  const { activeWorkspace } = useWorkspace();

  return (
    <div
      style={{
        position: "relative",
        padding: "20px 30px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#111827",
        }}
      >
        🏢 {activeWorkspace?.name || "No Workspace Selected"}
      </h2>

      <p
        style={{
          marginTop: 6,
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        AI searches across all uploaded documents in this workspace.
      </p>

      {activeWorkspace && (
        <div
          style={{
            position: "absolute",
            top: 22,
            right: 30,
            background: "#dbeafe",
            color: "#1d4ed8",
            padding: "8px 14px",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Active Workspace
        </div>
      )}
    </div>
  );
}
