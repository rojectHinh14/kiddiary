"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChildProfile extends Model {
    static associate(models) {
      ChildProfile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "parent",
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
      weight: { type: DataTypes.FLOAT },
      height: { type: DataTypes.FLOAT },
    },
    {
      sequelize,
      modelName: "ChildProfile",
      tableName: "ChildProfiles",
    }
  );
  return ChildProfile;
};
