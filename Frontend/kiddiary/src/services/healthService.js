import instance from "../axios"

const fromApiStatus = (s) => {
  const k = String(s || "").toLowerCase();
  if (k === "injected") return "DONE";
  if (k === "not_injected") return "NOT_YET";
  if (k === "skipped") return "SKIPPED";
  return "NONE";
};

const toApiStatus = (ui) => {
  const k = String(ui || "").toUpperCase();
  if (k === "DONE") return "injected";
  if (k === "NOT_YET") return "not_injected";
  if (k === "SKIPPED") return "skipped";
  return "not_injected";
};

export const getVaccinesByChild = async (childId) => {
  const res = await instance.get(`/api/children/${childId}/vaccines`);
  const data = res?.data;
  if (data?.errCode !== 0) throw new Error(data?.errMessage || "Load vaccines failed");
  return data?.data || [];
};

export const getChildVaccineDetail = async (childId, vaccineId) => {
  const res = await instance.get(`/api/children/${childId}/vaccines/${vaccineId}`);
  const data = res?.data;
  if (data?.errCode !== 0) throw new Error(data?.errMessage || "Load vaccine detail failed");
  return data?.data || {}; // <-- trả đúng object detail
};

export async function updateChildVaccineStatus({ childId, vaccineId, status, updateTime, note }) {
// status ở đây ĐÃ là status API ('injected' | 'not_injected' | 'skipped')
  const body = {
    status,
    updateTime: updateTime || null,
    note: note ?? null,
  };
  const res = await instance.put(`/api/children/${childId}/vaccines/${vaccineId}`, body);
  return res?.data?.data;
}

export function normalizeChildVaccines(rows) {
  return (rows || []).map((r) => ({
    id: r.id,
    status: fromApiStatus(r.status), // <-- UI status
    updateTime: r.updateTime || null,
    note: r.note || "",
    vaccine: r.Vaccine
      ? {
          id: r.Vaccine.id,
          name: r.Vaccine.vaccineName,
          diseaseName: r.Vaccine.diseaseName,
          description: r.Vaccine.description,
          type: r.Vaccine.vaccinationType,
        }
      : null,
    statusData: r.statusData || null,
  }));
}
export { fromApiStatus, toApiStatus };


