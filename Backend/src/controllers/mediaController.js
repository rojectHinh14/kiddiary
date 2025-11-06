import mediaService from "../services/mediaService.js";

const uploadMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileBase64, description, date } = req.body;
    if (!fileBase64) {
      return res
        .status(400)
        .json({ errCode: 1, message: "Missing fileBase64" });
    }

    const result = await mediaService.createMedia({
      userId,
      fileBase64,
      description,
      date,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error uploading media:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAllMediaByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const mediaList = await mediaService.getAllMediaByUser(userId);
    return res.status(200).json(mediaList);
  } catch (err) {
    console.error("Error fetching media:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
const deleteMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const mediaId = req.params.id;
    const result = await mediaService.deleteMedia(userId, mediaId);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting media:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const searchByAiTags = async (req, res) => {
  try {
    const userId = req.user.id;
    const { keyword } = req.query;
    const result = await mediaService.searchByAiTags(userId, keyword);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error searching media:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
export default { uploadMedia, getAllMediaByUser, deleteMedia, searchByAiTags };
