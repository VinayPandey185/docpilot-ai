import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import workspaceRoutes from "./routes/workspaceRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import toolRoutes from "./routes/toolRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tools", toolRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DocPilot AI API Running",
  });
});

export default app;
