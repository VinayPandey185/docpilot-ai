import { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../../services/documentService";
import { useWorkspace } from "../../context/WorkspaceContext";
import toast from "react-hot-toast";

export default function DocumentList() {
  const { activeWorkspace, documentVersion, refreshDocuments } = useWorkspace();

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (activeWorkspace) {
      loadDocuments();
    } else {
      setDocuments([]);
    }
  }, [activeWorkspace, documentVersion]);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments(activeWorkspace.id);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);

      refreshDocuments();

      toast.success("Pdf deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        padding: 18,
        borderRadius: 10,
        marginTop: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,.1)",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: 5,
        }}
      >
        📄 Documents ({documents.length})
      </h3>

      <p
        style={{
          color: "#6b7280",
          textAlign: "center",
          fontSize: 13,
          marginBottom: 15,
        }}
      >
        AI searches all uploaded PDFs.
      </p>

      {documents.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#64748b",
            padding: 20,
          }}
        >
          No documents uploaded yet.
        </div>
      ) : (
        <div
          style={{
            maxHeight: 260,
            overflowY: "auto",
            paddingRight: 5,
          }}
        >
          {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                marginBottom: 8,
                borderRadius: 8,
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  flex: 1,
                  overflow: "hidden",
                  marginRight: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={doc.filename}
                >
                  📄 {doc.filename}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    marginTop: 2,
                  }}
                >
                  Ready for AI Search
                </div>
              </div>

              <button
                onClick={() => handleDelete(doc.id)}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
