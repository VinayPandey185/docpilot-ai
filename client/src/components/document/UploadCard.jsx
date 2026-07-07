import { useRef, useState } from "react";
import { uploadDocument } from "../../services/documentService";
import { useWorkspace } from "../../context/WorkspaceContext";
import toast from "react-hot-toast";

export default function UploadCard() {
  const fileRef = useRef();

  const { activeWorkspace, refreshDocuments } = useWorkspace();

  const [loading, setLoading] = useState(false);

  const handleChooseFile = () => {
    if (!activeWorkspace) {
      alert("Please create or select a workspace.");
      return;
    }

    fileRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      await uploadDocument(file, activeWorkspace.id);

      // Refresh document list without reloading page
      refreshDocuments();

      toast.success("PDF uploaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        padding: 18,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,.1)",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        📤 Upload PDF
      </h3>

      <p
        style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        Select a PDF. AI automatically searches across all uploaded documents in
        this workspace.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        hidden
        onChange={handleFileChange}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleChooseFile}
          disabled={loading}
          style={{
            padding: "11px 24px",
            background: loading ? "#94a3b8" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: 15,
            minWidth: 180,
          }}
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>
    </div>
  );
}
