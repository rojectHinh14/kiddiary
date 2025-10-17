"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AlbumMedia extends Model {
    static associate(models) {}
  }
  AlbumMedia.init(
    {
      albumId: { type: DataTypes.INTEGER, allowNull: false },
      mediaId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "AlbumMedia", tableName: "AlbumMedia" }
  );
  return AlbumMedia;
};
