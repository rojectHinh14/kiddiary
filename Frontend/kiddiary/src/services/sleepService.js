// src/services/sleepService.js
import axios from "../axios";

/**
 * Lấy history giấc ngủ theo khoảng ngày [from, to].
 * Backend return: mảng log thuần.
 */
export const getSleepHistoryService = async (childId, { from, to } = {}) => {
  const res = await axios.get(`/api/children/${childId}/sleep`, {
    params: {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    },
  });

  // backend trả trực tiếp array logs
  return Array.isArray(res.data) ? res.data : [];
};

/**
 * Lấy dữ liệu 1 tuần (tuần chứa date hoặc theo week param).
 * Backend return: { weekStart, weekEnd, logs }
 */
const getWeekRange = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  const day = d.getDay(); // 0=Sun..6=Sat

  const start = new Date(d);
  start.setDate(d.getDate() - day);       // Chủ nhật

  const end = new Date(start);
  end.setDate(start.getDate() + 6);       // Thứ bảy

  const toISODate = (x) => x.toISOString().slice(0, 10);

  return {
    from: toISODate(start),
    to: toISODate(end),
  };
};

// Lấy sleep logs trong 1 tuần dùng /api/children/:childId/sleep?from=&to=
export const getSleepWeekService = async (childId, dateStr) => {
  const { from, to } = getWeekRange(dateStr);

  const res = await axios.get(`/api/children/${childId}/sleep`, {
    params: { from, to },
  });

  const data = res.data;
  if (!Array.isArray(data)) {
    throw new Error("Unexpected sleep API response");
  }

  return {
    childId,
    from,
    to,
    logs: data, 
  };
};

/**
 * Tạo log ngủ mới cho 1 bé
 * body ví dụ:
 * {
 *   sleepDate: "2025-11-16",
 *   startTime: "2025-11-16T22:00:00.000Z",
 *   endTime: "2025-11-16T23:30:00.000Z",
 *   quality: "GOOD",
 *   notes: "Ngủ sâu"
 * }
 * Backend return: object log vừa tạo
 */
export const createSleepLogService = async (childId, payload) => {
  const res = await axios.post(`/api/children/${childId}/sleep`, payload);
  return res.data; // log object
};

/**
 * Cập nhật 1 log ngủ
 * API: PUT /api/sleep/:id
 */
export const updateSleepLogService = async (sleepId, payload) => {
  const res = await axios.put(`/api/children/sleep/${sleepId}`, payload);
  return res.data; // log object
};

/**
 * Xóa 1 log ngủ
 * API: DELETE /api/sleep/:id
 */
export const deleteSleepLogService = async (sleepId) => {
  const res = await axios.delete(`/api/children/sleep/${sleepId}`);
  // { message: "Deleted successfully" }
  return res.data;
};
