import axios from "../axios";

export const uploadMediaService = (data) => {
  return axios.post("/api/media/upload", data);
};

export const getAllMediaByUserService = () => {
  return axios.get("/api/media");
};
