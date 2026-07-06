import supabase from "../config/supabase.js";

// Save a task
export const saveTask = async ({ workspaceId, title }) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      workspace_id: workspaceId,
      title,
      status: "Pending",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

// List all tasks
export const listTasks = async (workspaceId) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

// Log every tool execution
export const logToolCall = async ({
  workspaceId,
  toolName,
  argumentsData,
  resultData,
}) => {
  const { error } = await supabase.from("tool_logs").insert({
    workspace_id: workspaceId,
    tool_name: toolName,
    arguments: argumentsData,
    result: resultData,
  });

  if (error) throw error;

  return true;
};
export const getToolLogs = async (workspaceId) => {
  const { data, error } = await supabase
    .from("tool_logs")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};
