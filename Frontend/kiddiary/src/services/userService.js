import axios from "../axios";
export const registerUserService = (data) => {
  return axios.post("/api/register", data);
};
export const loginUserService = (data) => {
  return axios.post("/api/login", data);
};
