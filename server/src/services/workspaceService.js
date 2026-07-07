import supabase from "../config/supabase.js";

export const createWorkspaceService = async ({ name, user }) => {
  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      name,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const getWorkspacesService = async (user) => {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
};

export const deleteWorkspaceService = async ({ workspaceId, user }) => {
  // Verify workspace belongs to logged-in user
  const { data: workspace, error: findError } = await supabase
    .from("workspaces")
    .select("id")
    .eq("id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (findError || !workspace) {
    throw new Error("Workspace not found.");
  }

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);

  if (error) throw error;

  return true;
};
