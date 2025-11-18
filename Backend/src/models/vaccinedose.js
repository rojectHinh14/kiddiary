"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VaccineDose extends Model {
    static associate(models) {
      VaccineDose.belongsTo(models.Vaccine, {
        foreignKey: "vaccineId",
        as: "vaccine",
      });

      VaccineDose.hasMany(models.ChildVaccineDose, {
        foreignKey: "vaccineDoseId",
        as: "childDoses",
      });
    }
  }

  VaccineDose.init(
    {
      vaccineId: { type: DataTypes.INTEGER, allowNull: false },
      doseNumber: { type: DataTypes.INTEGER, allowNull: false },
      recommendedAge: DataTypes.STRING,
      doseDescription: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "VaccineDose",
      tableName: "VaccineDoses",
    }
  );

  return VaccineDose;
};
