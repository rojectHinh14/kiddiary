import db from "../models/index.js";

const createAlbum = async ({ userId, albumName, albumTypeCode }) => {
  try {
    const newAlbum = await db.Album.create({
      userId,
      albumName,
      albumTypeCode: albumTypeCode || "NORMAL",
    });
    return { errCode: 0, message: "Album created", data: newAlbum };
  } catch (err) {
    console.error("Error in createAlbum:", err);
    return { errCode: 2, message: "Error creating album" };
  }
};
const getAllAlbumsByUser = async (userId) => {
  try {
    const albums = await db.Album.findAll({
      where: { userId },
      include: [
        {
          model: db.Media,
          through: { attributes: [] },
          required: false,
        },
      ],
      raw: true,
      nest: true,
    });
    return { errCode: 0, data: albums };
  } catch (err) {
    console.error("Error fetching albums:", err);
    return { errCode: 1, message: "Error fetching albums" };
  }
};

const addMediaToAlbum = async (albumId, mediaIds) => {
  try {
    const album = await db.Album.findByPk(albumId);
    if (!album) return { errCode: 1, message: "Album not found" };

    const mediaList = await db.Media.findAll({
      where: { id: mediaIds },
    });
    if (!mediaList.length)
      return { errCode: 2, message: "No valid media found" };

    // === Thêm thủ công vào bảng AlbumMedia ===
    await db.AlbumMedia.bulkCreate(
      mediaIds.map((mediaId) => ({ albumId, mediaId })),
      { ignoreDuplicates: true } // Nếu Sequelize hỗ trợ
    );

    return { errCode: 0, message: "Media added to album" };
  } catch (err) {
    console.error("Error adding media:", err);
    return { errCode: 3, message: "Error adding media to album" };
  }
};

const getAlbumById = async (albumId) => {
  try {
    const album = await db.Album.findByPk(albumId, {
      include: [
        {
          model: db.Media,
          through: { attributes: [] },
        },
      ],
      raw: true,
      nest: true,
    });
    if (!album) return { errCode: 1, message: "Album not found" };
    return { errCode: 0, data: album };
  } catch (err) {
    console.error("Error fetching album:", err);
    return { errCode: 2, message: "Error fetching album" };
  }
};
export default {
  createAlbum,
  getAllAlbumsByUser,
  addMediaToAlbum,
  getAlbumById,
};
