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

export const updateMediaService = (data) => {
 const mediaId = data.id;
 const payload = { ...data }; 
 delete payload.id; 

 return axios.put(`/api/media/${mediaId}`, payload);
};
