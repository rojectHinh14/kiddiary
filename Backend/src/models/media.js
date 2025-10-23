"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {
      Media.belongsTo(models.User, { foreignKey: "userId" });
      Media.belongsToMany(models.Album, {
        through: models.AlbumMedia,
        foreignKey: "mediaId",
        otherKey: "albumId",
      });
    }
  }

  Media.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
fileUrl: DataTypes.TEXT("long"),
      fileTypeCode: DataTypes.STRING,
      description: DataTypes.TEXT,
      aiTags: DataTypes.JSON,
      date: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      sequelize,
      modelName: "Media",
      tableName: "Media",
    }
  );

  return Media;
};
