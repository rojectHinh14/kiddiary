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

export const getChildHistoryService = async (childId) => {
  const res = await axios.get(`/api/children/${childId}/history`);
  const d = res?.data;
  if (!d || d.errCode > 0) {
    throw new Error(d?.errMessage || "Load child history failed");
  }
  return d.data || [];
};
export const createChildHistoryService = async (childId, payload) => {
  const res = await axios.post(`/api/children/${childId}/history`, payload);
  const d = res?.data;
  if (!d || d.errCode > 0) {
    throw new Error(d?.errMessage || "Create child history failed");
  }
  return d.data;
};
export const updateChildHistoryService = async (
  childId,
  historyId,
  payload
) => {
  const res = await axios.put(
    `/api/children/${childId}/history/${historyId}`,
    payload
  );
  const d = res?.data;
  if (!d || d.errCode > 0) {
    throw new Error(d?.errMessage || "Update child history failed");
  }
  return d.data;
};

export const deleteChildHistoryService = async (childId, historyId) => {
  const res = await axios.delete(
    `/api/children/${childId}/history/${historyId}`
  );
  const d = res?.data;
  if (!d || d.errCode > 0) {
    throw new Error(d?.errMessage || "Delete child history failed");
  }
  return true;
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

export const getChildVaccines = async (childId) => {
  const response = await axios.get(`/api/children/${childId}/vaccines`);
  if (response.data.errCode === 0) {
    return response.data.data;
  }
  throw new Error(response.data.errMessage || "Lỗi khi lấy dữ liệu vaccine");
};
