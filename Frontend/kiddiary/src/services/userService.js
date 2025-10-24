import axios from "../axios";
export const registerUserService = (data) => {
  return axios.post("/api/register", data);
};
export const loginUserService = (data) => {
  return axios.post("/api/login", data);
};
export const getUserProfileService = () => {
  return axios.get("/api/user/profile");
};

export const updateUserService = (userId, data) => {
  return axios.put(`/api/users/${userId}`, data);
};
