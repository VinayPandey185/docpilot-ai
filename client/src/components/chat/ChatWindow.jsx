import { useEffect, useState } from "react";
import { askQuestion, getChatHistory } from "../../services/chatService";
import { useWorkspace } from "../../context/WorkspaceContext";
import toast from "react-hot-toast";

export default function ChatWindow() {
  const { activeWorkspace, refreshToolLogs } = useWorkspace();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load previous chat history whenever workspace changes
  useEffect(() => {
    if (activeWorkspace) {
      loadHistory();
    } else {
      setMessages([]);
    }
  }, [activeWorkspace]);

  const loadHistory = async () => {
    try {
      const history = await getChatHistory(activeWorkspace.id);

      const chatMessages = [];

      history.forEach((chat) => {
        chatMessages.push({
          role: "user",
          text: chat.question,
        });

        chatMessages.push({
          role: "assistant",
          text: chat.answer,
          sources: [],
        });
      });

      setMessages(chatMessages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendQuestion = async () => {
    if (!question.trim()) return;

    if (!activeWorkspace) {
      toast.error("Please select a workspace.");
      return;
    }

    const userMessage = {
      role: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);

      const result = await askQuestion(activeWorkspace.id, question);

      const aiMessage = {
        role: "assistant",
        text: result.answer,
        sources: result.sources || [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Refresh Recent Tool Calls
      refreshToolLogs();

      setQuestion("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Chat failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: 20,
        background: "#fff",
        borderRadius: 10,
        padding: 20,
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
        💬 Chat with Workspace Documents
      </h3>

      <p
        style={{
          color: "#6b7280",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        AI searches across all uploaded documents in the active workspace.
      </p>

      <div
        style={{
          height: 420,
          overflowY: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
          background: "#f8fafc",
        }}
      >
        {messages.length === 0 && (
          <p
            style={{
              color: "#6b7280",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Ask anything about the uploaded documents.
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: 20,
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "12px 16px",
                borderRadius: 12,
                background: msg.role === "user" ? "#2563eb" : "#e5e7eb",
                color: msg.role === "user" ? "#fff" : "#111827",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
              }}
            >
              {msg.text}
            </div>

            {msg.role === "assistant" && msg.sources?.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 13,
                  display: "inline-block",
                  maxWidth: "80%",
                }}
              >
                <strong>📚 Sources</strong>

                {msg.sources.map((source, i) => (
                  <div
                    key={i}
                    style={{
                      marginTop: 8,
                      color: "#475569",
                    }}
                  >
                    📄 {source.filename}
                    {source.pageNumber && ` (Page ${source.pageNumber})`}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <p
            style={{
              color: "#2563eb",
              textAlign: "center",
            }}
          >
            🤖 Thinking...
          </p>
        )}
      </div>

      <textarea
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about the uploaded documents..."
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #d1d5db",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={sendQuestion}
        disabled={loading}
        style={{
          marginTop: 15,
          padding: "12px 24px",
          border: "none",
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}
