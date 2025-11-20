// src/services/childModel.js
const { sequelize } = require("../models");

/**
 * Get full children info for a user:
 * - child profile
 * - growth history
 * - milk logs
 * - sleep logs
 * - vaccine doses + vaccine info
 */
export async function getChildrenFullInfoByUserId(userId) {
  const [rows] = await sequelize.query(
    `
    SELECT
      -- Child basic info
      cp.id AS childId,
      cp.userId,
      cp.firstName,
      cp.lastName,
      cp.dob,
      cp.genderCode,
      cp.avatarUrl,

      -- Current weight/height from latest childhistory
      (
        SELECT ch2.weight
        FROM childhistories ch2
        WHERE ch2.childId = cp.id
        ORDER BY ch2.date DESC
        LIMIT 1
      ) AS currentWeight,

      (
        SELECT ch3.height
        FROM childhistories ch3
        WHERE ch3.childId = cp.id
        ORDER BY ch3.date DESC
        LIMIT 1
      ) AS currentHeight,

      -- Growth history
      ch.id AS historyId,
      ch.date AS historyDate,
      ch.weight AS historyWeight,
      ch.height AS historyHeight,

      -- Milk logs
      ml.id AS milkLogId,
      ml.feedingAt,
      ml.amountMl,
      ml.sourceCode,
      ml.moodTags,
      ml.note AS milkNote,

      -- Sleep logs
      sl.id AS sleepId,
      sl.sleepDate,
      sl.startTime,
      sl.endTime,
      sl.duration,
      sl.quality,
      sl.notes AS sleepNote,

      -- Child-vaccine-dose link
      cvd.id AS childVaccineDoseId,
      cvd.status AS vaccineStatus,
      cvd.injectedDate,
      cvd.note AS vaccineNote,

      -- Vaccine dose info
      vd.id AS vaccineDoseId,
      vd.doseNumber,
      vd.recommendedAge,
      vd.doseDescription,

      -- Vaccine master info
      v.id AS vaccineId,
      v.vaccinationType,
      v.diseaseName,
      v.vaccineName,
      v.about,
      v.description,
      v.required,
      v.recommendedDate,
      v.symptoms

    FROM childprofiles cp
      LEFT JOIN childhistories     ch  ON ch.childId  = cp.id
      LEFT JOIN childmilklogs      ml  ON ml.childId  = cp.id
      LEFT JOIN childsleeplogs     sl  ON sl.childId  = cp.id
      LEFT JOIN childvaccinedoses  cvd ON cvd.childId = cp.id
      LEFT JOIN vaccinedoses       vd  ON vd.id       = cvd.vaccineDoseId
      LEFT JOIN vaccines           v   ON v.id        = vd.vaccineId
    WHERE cp.userId = ?
    ORDER BY
      cp.id,
      ch.date DESC,
      ml.feedingAt DESC,
      sl.sleepDate DESC,
      vd.doseNumber ASC
  `,
    { replacements: [userId] }
  );

  //----------------------------------------------------
  // Convert flat rows → nested children map
  //----------------------------------------------------
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

    // Growth history
    if (row.historyId) {
      child.histories.push({
        id: row.historyId,
        date: row.historyDate,
        weight: row.historyWeight,
        height: row.historyHeight,
      });
    }

    // Milk logs
    if (row.milkLogId) {
      child.milkLogs.push({
        id: row.milkLogId,
        feedingAt: row.feedingAt,
        amountMl: row.amountMl,
        sourceCode: row.sourceCode,
        moodTags: row.moodTags,
        note: row.milkNote,
      });
    }

    // Sleep logs
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

    // Vaccines (per dose)
    if (row.childVaccineDoseId) {
      child.vaccines.push({
        childVaccineDoseId: row.childVaccineDoseId,
        vaccineStatus: row.vaccineStatus,
        injectedDate: row.injectedDate,
        vaccineNote: row.vaccineNote,

        vaccineDoseId: row.vaccineDoseId,
        doseNumber: row.doseNumber,
        recommendedAge: row.recommendedAge,
        doseDescription: row.doseDescription,

        vaccineId: row.vaccineId,
        vaccinationType: row.vaccinationType,
        diseaseName: row.diseaseName,
        vaccineName: row.vaccineName,
        about: row.about,
        description: row.description,
        required: row.required,
        recommendedDate: row.recommendedDate,
        symptoms: row.symptoms,
      });
    }
  }

  return Object.values(childrenMap);
}

// Optional default export
const childService = { getChildrenFullInfoByUserId };
export default childService;
