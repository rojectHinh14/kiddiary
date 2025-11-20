import axios from "../axios";

export const createAlbumService = (data) => {
  return axios.post("/api/albums", data);
};

export const getAllAlbumsByUserService = () => {
  return axios.get("/api/albums");
};
export const getAlbumByIdService = (albumId) => {
  return axios.get(`/api/albums/${albumId}`);
};

export const addMediaToAlbumService = (albumId, mediaIds) => {
  return axios.post(`/api/albums/${albumId}/media`, { mediaIds });
};
export const removeManyFromAlbumService = async (albumId, mediaIds = []) => {
  const ids = mediaIds.map(String);
  // gọi API đơn lẻ song song:
  const results = await Promise.allSettled(
    ids.map((mid) => axios.delete(`/api/albums/${albumId}/media/${mid}`))
  );
  const ok = results
    .map((r, i) =>
      r.status === "fulfilled" && r.value?.data?.errCode === 0 ? ids[i] : null
    )
    .filter(Boolean);
  if (!ok.length) throw new Error("No deletion succeeded");
  return ok;
};
export const deleteAlbumService = async (albumId) => {
  return await axios.delete(`/api/albums/${albumId}`);
};
