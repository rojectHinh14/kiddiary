"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AlbumMedia extends Model {
    static associate(models) {}
  }

  AlbumMedia.init(
    {
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // ← THÊM ĐÂY
        references: {
          model: "Albums",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // ← THÊM ĐÂY
        references: {
          model: "Media",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "AlbumMedia",
      tableName: "AlbumMedia",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return AlbumMedia;
};
