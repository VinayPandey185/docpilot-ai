import {
  createWorkspaceService,
  getWorkspacesService,
  deleteWorkspaceService,
} from "../services/workspaceService.js";

export const createWorkspace = async (req, res) => {
  try {
    const result = await createWorkspaceService({
      name: req.body.name,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWorkspaces = async (req, res) => {
  try {
    const result = await getWorkspacesService(req.user);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    await deleteWorkspaceService({
      workspaceId: req.params.workspaceId,
      user: req.user,
    });

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
