// src/services/childModel.js
const { sequelize } = require("../models");

/**
 * Lấy full dữ liệu tất cả bé của 1 user:
 * - Thông tin cơ bản
 * - Lịch sử cân nặng / chiều cao
 * - Nhật ký uống sữa
 * - Lịch sử ngủ
 * - Vaccine tổng quát (childvaccines)
 * - Vaccine theo từng mũi (childvaccinedoses + vaccinedoses)
 */
export async function getChildrenFullInfoByUserId(userId) {
  const [rows] = await sequelize.query(
    `
    SELECT
      cp.id AS childId,
      cp.userId,
      cp.firstName,
      cp.lastName,
      cp.dob,
      cp.genderCode,
      cp.avatarUrl,
      cp.weight AS currentWeight,
      cp.height AS currentHeight,

      -- lịch sử phát triển
      ch.id AS historyId,
      ch.date AS historyDate,
      ch.weight AS historyWeight,
      ch.height AS historyHeight,

      -- nhật ký sữa
      ml.id AS milkLogId,
      ml.feedingAt,
      ml.amountMl,
      ml.moodTags,
      ml.note AS milkNote,

      -- lịch sử ngủ
      sl.id AS sleepId,
      sl.sleepDate,
      sl.startTime,
      sl.endTime,
      sl.duration,
      sl.quality,
      sl.notes AS sleepNote,

      -- bảng tổng hợp vaccine theo loại (nếu bạn vẫn dùng)
      cv.id AS childVaccineId,
      cv.status AS vaccineStatus,
      cv.updateTime AS vaccineUpdateTime,
      v.id  AS vaccineId,
      v.vaccinationType,
      v.diseaseName,
      v.vaccineName,
      v.recommendedDate,

      -- THÊM: vaccine theo từng mũi
      cvd.id           AS childVaccineDoseId,
      cvd.status       AS doseStatus,
      cvd.injectedDate AS doseInjectedDate,
      cvd.note         AS doseNote,
      vd.id            AS vaccineDoseId,
      vd.doseNumber,
      vd.recommendedAge,
      vd.doseDescription

    FROM childprofiles cp
      LEFT JOIN childhistories    ch  ON ch.childId  = cp.id
      LEFT JOIN childmilklogs     ml  ON ml.childId  = cp.id
      LEFT JOIN childsleeplogs    sl  ON sl.childId  = cp.id

      -- tổng hợp vaccine theo loại
      LEFT JOIN childvaccines     cv  ON cv.childId  = cp.id
      LEFT JOIN vaccines          v   ON v.id        = cv.vaccineId

      -- chi tiết từng mũi
      LEFT JOIN childvaccinedoses cvd ON cvd.childId     = cp.id
      LEFT JOIN vaccinedoses      vd  ON vd.id          = cvd.vaccineDoseId
      -- dùng lại bảng vaccines nếu muốn
      -- LEFT JOIN vaccines       v2  ON v2.id          = vd.vaccineId

    WHERE cp.userId = ?
    ORDER BY cp.id
  `,
    { replacements: [userId] }
  );

  const childrenMap = {};

  for (const row of rows) {
    const childId = row.childId;
    if (!childrenMap[childId]) {
      childrenMap[childId] = {
        id: childId,
        userId: row.userId,
        firstName: row.firstName,
        lastName: row.lastName,
        dob: row.dob,
        genderCode: row.genderCode,
        avatarUrl: row.avatarUrl,
        currentWeight: row.currentWeight,
        currentHeight: row.currentHeight,

        histories: [],
        milkLogs: [],
        sleepLogs: [],
        vaccines: [],        // tổng hợp theo loại (cũ)
        vaccineDoses: [],    // danh sách từng mũi (mới)
      };
    }

    const child = childrenMap[childId];

    // lịch sử phát triển
    if (row.historyId) {
      child.histories.push({
        id: row.historyId,
        date: row.historyDate,
        weight: row.historyWeight,
        height: row.historyHeight,
      });
    }

    // nhật ký sữa
    if (row.milkLogId) {
      child.milkLogs.push({
        id: row.milkLogId,
        feedingAt: row.feedingAt,
        amountMl: row.amountMl,
        moodTags: row.moodTags,
        note: row.milkNote,
      });
    }

    // nhật ký ngủ
    if (row.sleepId) {
      child.sleepLogs.push({
        id: row.sleepId,
        sleepDate: row.sleepDate,
        startTime: row.startTime,
        endTime: row.endTime,
        duration: row.duration,
        quality: row.quality,
        note: row.sleepNote,
      });
    }

    // tổng hợp vaccine theo loại (nếu vẫn dùng)
    if (row.childVaccineId) {
      child.vaccines.push({
        childVaccineId: row.childVaccineId,
        vaccineId: row.vaccineId,
        status: row.vaccineStatus,
        updateTime: row.vaccineUpdateTime,
        vaccinationType: row.vaccinationType,
        diseaseName: row.diseaseName,
        vaccineName: row.vaccineName,
        recommendedDate: row.recommendedDate,
      });
    }

    // chi tiết từng mũi
    if (row.childVaccineDoseId) {
      child.vaccineDoses.push({
        childVaccineDoseId: row.childVaccineDoseId,
        vaccineDoseId: row.vaccineDoseId,
        status: row.doseStatus,
        injectedDate: row.doseInjectedDate,
        note: row.doseNote,

        doseNumber: row.doseNumber,
        recommendedAge: row.recommendedAge,
        doseDescription: row.doseDescription,

        // nếu bạn muốn gộp thêm tên vaccine:
        vaccineId: row.vaccineId,
        vaccinationType: row.vaccinationType,
        diseaseName: row.diseaseName,
        vaccineName: row.vaccineName,
      });
    }
  }

  return Object.values(childrenMap);
}

// default export
const childService = { getChildrenFullInfoByUserId };
export default childService;
