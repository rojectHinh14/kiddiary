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

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result); // giữ prefix data:image/...;base64,
    r.onerror = reject;
    r.readAsDataURL(file);
  });
export const deleteChild = async (id) => {
  const res = await axios.delete(`/api/children/${id}`);
  const d = res?.data;
  if (!d || d.errCode > 0) throw new Error(d?.errMessage || "Delete failed");
  return true; 
};

 export const updateChild = (id, payload) =>
  axios.put(`/api/children/${id}`, payload);