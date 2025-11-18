"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChildVaccineDose extends Model {
    static associate(models) {
      ChildVaccineDose.belongsTo(models.ChildProfile, {
        foreignKey: "childId",
        as: "child",
      });

      ChildVaccineDose.belongsTo(models.VaccineDose, {
        foreignKey: "vaccineDoseId",
        as: "dose",
      });

      ChildVaccineDose.belongsTo(models.AllCode, {
        foreignKey: "status",
        targetKey: "keyMap",
        as: "statusData",
      });
    }
  }

  ChildVaccineDose.init(
    {
      childId: { type: DataTypes.INTEGER, allowNull: false },
      vaccineDoseId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, defaultValue: "not_injected" },
      injectedDate: DataTypes.DATE,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ChildVaccineDose",
      tableName: "ChildVaccineDoses",
    }
  );

  return ChildVaccineDose;
};
