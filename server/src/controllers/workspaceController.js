import {
  createWorkspaceService,
  getWorkspacesService,
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
