"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChildSleepLog extends Model {
    static associate(models) {
      ChildSleepLog.belongsTo(models.ChildProfile, {
        foreignKey: "childId",
        as: "child",
      });
    }
  }

  ChildSleepLog.init(
    {
      childId: { type: DataTypes.INTEGER, allowNull: false },
      sleepDate: { type: DataTypes.DATEONLY, allowNull: false },
      startTime: { type: DataTypes.DATE, allowNull: false },
      endTime: { type: DataTypes.DATE },
      duration: { type: DataTypes.INTEGER },
      quality: {
        type: DataTypes.ENUM("GOOD", "FUSSY", "STARTLED"),
        allowNull: false,
      },
      notes: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "ChildSleepLog",
      tableName: "ChildSleepLogs",
    }
  );

  return ChildSleepLog;
};
