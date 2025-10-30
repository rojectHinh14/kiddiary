import axios from "../axios";

export const createChildService = async (data) => {
  return axios.post("/api/children", data);
};
export const getChildrenService = async () => {
  return axios.get("/api/children");
};
