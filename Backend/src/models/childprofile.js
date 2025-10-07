"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChildProfile extends Model {
    static associate(models) {}
  }
  ChildProfile.init(
    {
      familyId: { type: DataTypes.INTEGER, allowNull: false },
      fullName: DataTypes.STRING,
      dob: DataTypes.DATE,
      genderCode: DataTypes.STRING, // FK -> AllCode.keyMap
      avatarUrl: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ChildProfile",
      tableName: "ChildProfiles",
    }
  );
  return ChildProfile;
};
