"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      Album.belongsTo(models.User, { foreignKey: "userId" });
      Album.belongsToMany(models.Media, {
        through: models.AlbumMedia,
        foreignKey: "albumId",
        otherKey: "mediaId",
      });
    }
  }

  Album.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      albumName: DataTypes.STRING,
      albumTypeCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Album",
      tableName: "Albums",
      freezeTableName: true,
    }
  );

  return Album;
};
