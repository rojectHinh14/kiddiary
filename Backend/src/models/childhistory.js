"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChildHistory extends Model {
    static associate(models) {
      ChildHistory.belongsTo(models.ChildProfile, {
        foreignKey: "childId",
        as: "child",
      });
    }
  }

  ChildHistory.init(
    {
      childId: { type: DataTypes.INTEGER, allowNull: false },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      weight: { type: DataTypes.FLOAT, allowNull: false },
      height: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      sequelize,
      modelName: "ChildHistory",
      tableName: "ChildHistories",
    }
  );

  return ChildHistory;
};
