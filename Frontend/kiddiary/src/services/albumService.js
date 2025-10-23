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
