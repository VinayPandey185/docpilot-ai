import { askGroq } from "./groqService.js";
import { saveTask, listTasks, logToolCall } from "../toolService.js";

export const runAgent = async ({ workspaceId, question, chunks }) => {
  // Detect whether the user is requesting a tool
  const toolPrompt = `
You are an AI assistant.

Available tools:

1. save_task
Description:
Save a task for the user.

Arguments:
{
  "title":"task title"
}

2. list_tasks
Description:
List every task in the workspace.

Rules:
- If the user wants to remember something, save something, create a task, remind later, respond ONLY with JSON.
Example:
{
 "tool":"save_task",
 "title":"Update README tomorrow"
}

- If the user asks to show tasks, list tasks, my tasks, respond ONLY with JSON.
Example:
{
 "tool":"list_tasks"
}

- Otherwise respond:
{
 "tool":"none"
}

User:
${question}
`;

  const toolDecision = await askGroq(toolPrompt, []);

  let parsed;

  try {
    parsed = JSON.parse(toolDecision);
  } catch {
    parsed = { tool: "none" };
  }

  // -----------------------
  // SAVE TASK
  // -----------------------

  if (parsed.tool === "save_task") {
    const task = await saveTask({
      workspaceId,
      title: parsed.title,
    });

    await logToolCall({
      workspaceId,
      toolName: "save_task",
      argumentsData: parsed,
      resultData: task,
    });

    return "Task saved successfully.";
  }

  // -----------------------
  // LIST TASKS
  // -----------------------

  if (parsed.tool === "list_tasks") {
    const tasks = await listTasks(workspaceId);

    await logToolCall({
      workspaceId,
      toolName: "list_tasks",
      argumentsData: {},
      resultData: tasks,
    });

    if (tasks.length === 0) {
      return "You don't have any tasks.";
    }

    return tasks
      .map((task, index) => `${index + 1}. ${task.title} (${task.status})`)
      .join("\n");
  }

  // -----------------------
  // NORMAL RAG
  // -----------------------

  return await askGroq(question, chunks);
};
