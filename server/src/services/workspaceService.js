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
