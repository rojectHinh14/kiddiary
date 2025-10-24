import albumService from "../services/albumService.js";

const createAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { albumName, albumTypeCode } = req.body;

    if (!albumName) {
      return res
        .status(400)
        .json({ errCode: 1, message: "Missing album name" });
    }

    const result = await albumService.createAlbum({
      userId,
      albumName,
      albumTypeCode,
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error creating album:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAllAlbumsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const albums = await albumService.getAllAlbumsByUser(userId);
    return res.status(200).json(albums);
  } catch (err) {
    console.error("Error fetching albums:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const addMediaToAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { mediaIds } = req.body;
    const userId = req.user.id; // ← THÊM

    if (!mediaIds || !Array.isArray(mediaIds)) {
      return res.status(400).json({ errCode: 1, message: "Invalid mediaIds" });
    }

    const result = await albumService.addMediaToAlbum(
      albumId,
      mediaIds,
      userId
    ); // ← PASS userId
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error adding media to album:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAlbumById = async (req, res) => {
  try {
    const { albumId } = req.params;
    const userId = req.user.id; // ← THÊM
    const album = await albumService.getAlbumById(albumId, userId); // ← PASS userId
    return res.status(200).json(album);
  } catch (err) {
    console.error("Error fetching album:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
export default {
  createAlbum,
  getAllAlbumsByUser,
  addMediaToAlbum,
  getAlbumById,
};
