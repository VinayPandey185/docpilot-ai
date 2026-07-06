import { getToolLogs } from "../services/toolService.js";

export const fetchToolLogs = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const logs = await getToolLogs(workspaceId);

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
