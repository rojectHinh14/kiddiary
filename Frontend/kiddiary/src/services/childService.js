import axios from "../axios";

export const createChildService = async (data) => {
  return axios.post("/api/children", data);
};
export const getChildrenService = async () => {
  return axios.get("/api/children");
};
export const getChildrenByUser = async () => {
  const { data } = await axios.get("api/children");
  if (data?.errCode > 0) {
    throw new Error(data.errMessage || "Load children failed");
  }
  return data.data || []; 
};
