import axios from "../axios";

export const getChildMilkLogsService = async (childId, date) => {
  const res = await axios.get(`/api/children/${childId}/milk-logs`, {
    params: date ? { date } : {},
  });

  const d = res?.data;
  if (!d || d.errCode !== 0) {
    throw new Error(d?.errMessage || "Load milk logs failed");
  }

  return d.data || {
    date: null,
    totalToday: 0,
    logs: [],
    last7Days: [],
  };
};

export const createChildMilkLogService = async (childId, payload) => {
  const res = await axios.post(`/api/children/${childId}/milk-logs`, payload);
  const d = res?.data;
  if (!d || d.errCode !== 0) {
    throw new Error(d?.errMessage || "Create milk log failed");
  }
  return d.data; 
};

export const deleteChildMilkLogService = async (childId, milkLogId) => {
  const res = await axios.delete(
    `/api/children/${childId}/milk-logs/${milkLogId}`
  );
  const d = res.data;
  if (!d || d.errCode !== 0) {
    throw new Error(d?.errMessage || "Delete milk log failed");
  }
  return milkLogId;
};

export const updateChildMilkLogService = async (
  childId,
  milkLogId,
  payload
) => {
  const res = await axios.put(
    `/api/children/${childId}/milk-logs/${milkLogId}`,
    payload
  );
  const d = res.data;
  if (!d || d.errCode !== 0) {
    throw new Error(d?.errMessage || "Update milk log failed");
  }
  return d.data;
};
export const getChildMilkLogsByDateRangeService = async (childId, fromDate, toDate) => {
  const res = await axios.get(`/api/children/${childId}/milk-logs-range`, { 
    params: { fromDate, toDate }, 
  });

  const d = res?.data;
  if (!d || d.errCode !== 0) {
    throw new Error(d?.errMessage || "Load milk logs by date range failed");
  }

  return d.data || {
    date: null,
    totalToday: 0,
    logs: [],
    last7Days: [],
  };
};
