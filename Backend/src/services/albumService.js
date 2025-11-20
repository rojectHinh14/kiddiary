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
const removeMediaFromAlbum = async (albumId, mediaId, userId) => {
  try {
    const album = await db.Album.findByPk(albumId);
    if (!album || album.userId !== userId) {
      return { errCode: 1, message: "Album not found or not authorized" };
    }

    const media = await db.Media.findByPk(mediaId);
    if (!media) {
      return { errCode: 2, message: "Media not found" };
    }

    const deleted = await db.AlbumMedia.destroy({
      where: { albumId, mediaId },
    });

    if (deleted === 0) {
      return { errCode: 3, message: "Media not found in album" };
    }

    return { errCode: 0, message: "Media removed from album successfully" };
  } catch (err) {
    console.error("Error removing media from album:", err);
    return { errCode: 4, message: "Error removing media from album" };
  }
};
const deleteAlbum = async (userId, albumId) => {
  const album = await db.Album.findOne({
    where: { id: albumId, userId },
    include: [
      {
        model: db.Media,
        through: { attributes: [] }, // bỏ AlbumMedia
      },
    ],
  });

  if (!album) throw new Error("Album not found or no permission");

  const mediaList = album.Media;

  // Lấy id media để xoá
  const mediaIds = mediaList.map((m) => m.id);

  // 1. Xóa record trong AlbumMedia
  await db.AlbumMedia.destroy({
    where: { albumId },
  });

  // 2. Xóa media liên kết
  if (mediaIds.length > 0) {
    await db.Media.destroy({
      where: { id: mediaIds },
    });
  }

  // 3. Xóa album
  await db.Album.destroy({
    where: { id: albumId, userId },
  });

  return { deletedMedia: mediaIds, deletedAlbumId: albumId };
};
export default {
  createAlbum,
  getAllAlbumsByUser,
  addMediaToAlbum,
  getAlbumById,
  removeMediaFromAlbum,
  deleteAlbum,
};
