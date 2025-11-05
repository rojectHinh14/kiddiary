import instance from "../axios";
import axios from "../axios";

export const uploadMediaService = (data) => {
  return axios.post("/api/media/upload", data);
};

export const getAllMediaByUserService = () => {
  return axios.get("/api/media");
};
export async function deleteMedia(mediaId) {
  const res = await axios.delete(`/api/media/${mediaId}`);
  return res.data; // { errCode, message }
}