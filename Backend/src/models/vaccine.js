"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vaccine extends Model {
    static associate(models) {
      Vaccine.hasMany(models.ChildVaccine, { foreignKey: "vaccineId" });
    }
  }

  Vaccine.init(
    {
      vaccineName: { type: DataTypes.STRING, allowNull: false },
      vaccinationType: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      about: DataTypes.TEXT,
      required: { type: DataTypes.BOOLEAN, defaultValue: true },
      recommendedDate: DataTypes.DATE,
      symptoms: DataTypes.TEXT,
      diseaseName: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Vaccine",
      tableName: "Vaccines",
    }
  );

  return Vaccine;
};
