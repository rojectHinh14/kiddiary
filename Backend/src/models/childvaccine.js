// models/childvaccine.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChildVaccine extends Model {
    static associate(models) {
      ChildVaccine.belongsTo(models.ChildProfile, { foreignKey: "childId" });
      ChildVaccine.belongsTo(models.Vaccine, { foreignKey: "vaccineId" });
      ChildVaccine.belongsTo(models.AllCode, {
        foreignKey: "status",
        targetKey: "keyMap",
        as: "statusData",
      });
    }
  }

  ChildVaccine.init(
    {
      childId: { type: DataTypes.INTEGER, allowNull: false },
      vaccineId: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "not_injected",
      }, // liên kết AllCode
      updateTime: DataTypes.DATE,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ChildVaccine",
      tableName: "ChildVaccines",
    }
  );

  return ChildVaccine;
};
