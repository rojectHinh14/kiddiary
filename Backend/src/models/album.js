"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {}
  }
  Album.init(
    {
      familyId: { type: DataTypes.INTEGER, allowNull: false },
      childId: DataTypes.INTEGER,
      albumName: DataTypes.STRING,
      albumTypeCode: DataTypes.STRING, // FK -> AllCode.keyMap
    },
    {
      sequelize,
      modelName: "Album",
      tableName: "Albums",
    }
  );
  return Album;
};
