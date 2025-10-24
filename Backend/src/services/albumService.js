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
    });
    return { errCode: 0, data: albums };
  } catch (err) {
    console.error("Error fetching albums:", err);
    return { errCode: 1, message: "Error fetching albums" };
  }
};
const addMediaToAlbum = async (albumId, mediaIds, userId) => {
  // ← THÊM userId
  try {
    const album = await db.Album.findByPk(albumId);
    if (!album || album.userId !== userId)
      // ← THÊM CHECK
      return { errCode: 1, message: "Album not found" };

    const mediaList = await db.Media.findAll({
      where: { id: mediaIds, userId }, // ← THÊM userId CHECK
    });
    if (mediaList.length !== mediaIds.length)
      // ← CẢI THIỆN: Check exact match
      return {
        errCode: 2,
        message: "Some media not found or not owned by user",
      };

    await db.AlbumMedia.bulkCreate(
      mediaIds.map((mediaId) => ({ albumId, mediaId })),
      { ignoreDuplicates: true }
    );

    return { errCode: 0, message: "Media added to album" };
  } catch (err) {
    console.error("Error adding media:", err);
    return { errCode: 3, message: "Error adding media to album" };
  }
};

const getAlbumById = async (albumId, userId) => {
  // ← THÊM userId
  try {
    const album = await db.Album.findByPk(albumId, {
      include: [
        {
          model: db.Media,
          through: { attributes: [] },
        },
      ],
    });
    if (!album || album.userId !== userId)
      // ← THÊM CHECK
      return { errCode: 1, message: "Album not found" };
    return { errCode: 0, data: album.toJSON() };
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
