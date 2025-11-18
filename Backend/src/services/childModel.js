// src/services/childModel.js
const { sequelize } = require("../models"); 

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

      ch.id AS historyId,
      ch.date AS historyDate,
      ch.weight AS historyWeight,
      ch.height AS historyHeight,

      ml.id AS milkLogId,
      ml.feedingAt,
      ml.amountMl,
      ml.moodTags,
      ml.note AS milkNote,

      sl.id AS sleepId,
      sl.sleepDate,
      sl.startTime,
      sl.endTime,
      sl.duration,
      sl.quality,
      sl.notes AS sleepNote,

      cv.id AS childVaccineId,
      cv.status AS vaccineStatus,
      cv.updateTime AS vaccineUpdateTime,
      v.id AS vaccineId,
      v.vaccinationType,
      v.diseaseName,
      v.vaccineName,
      v.recommendedDate
    FROM childprofiles cp
      LEFT JOIN childhistories ch ON ch.childId = cp.id
      LEFT JOIN childmilklogs ml ON ml.childId = cp.id
      LEFT JOIN childsleeplogs sl ON sl.childId = cp.id
      LEFT JOIN childvaccines cv ON cv.childId = cp.id
      LEFT JOIN vaccines v ON v.id = cv.vaccineId
    WHERE cp.userId = ?
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
        vaccines: [],
      };
    }

    const child = childrenMap[childId];

    if (row.historyId) {
      child.histories.push({
        id: row.historyId,
        date: row.historyDate,
        weight: row.historyWeight,
        height: row.historyHeight,
      });
    }

    if (row.milkLogId) {
      child.milkLogs.push({
        id: row.milkLogId,
        feedingAt: row.feedingAt,
        amountMl: row.amountMl,
        moodTags: row.moodTags,
        note: row.milkNote,
      });
    }

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
  }

  return Object.values(childrenMap);
}

// thêm default export nếu sau này muốn import kiểu khác
const childService = { getChildrenFullInfoByUserId };
export default childService;
