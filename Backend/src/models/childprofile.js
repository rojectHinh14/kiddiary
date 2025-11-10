"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChildProfile extends Model {
    static associate(models) {
      ChildProfile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "parent",
      });
      ChildProfile.hasMany(models.ChildVaccine, {
        foreignKey: "childId",
        as: "vaccines",
      });
      ChildProfile.hasMany(models.ChildHistory, {
        foreignKey: "childId",
        as: "histories",
      });
    }
  }

  ChildProfile.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      dob: { type: DataTypes.DATE, allowNull: false },
      genderCode: { type: DataTypes.STRING },
      avatarUrl: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "ChildProfile",
      tableName: "ChildProfiles",
    }
  );

  return ChildProfile;
};
