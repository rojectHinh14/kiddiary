"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FamilyMember extends Model {
    static associate(models) {}
  }
  FamilyMember.init(
    {
      familyId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      relationCode: { type: DataTypes.STRING }, // FK -> AllCode.keyMap
    },
    {
      sequelize,
      modelName: "FamilyMember",
      tableName: "FamilyMembers",
    }
  );
  return FamilyMember;
};
