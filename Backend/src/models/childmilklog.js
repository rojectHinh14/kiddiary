const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChildMilkLog extends Model {
    static associate(models) {
      ChildMilkLog.belongsTo(models.ChildProfile, {
        foreignKey: "childId",
        as: "child",
      });
    }
  }

  ChildMilkLog.init(
    {
      childId: { type: DataTypes.INTEGER, allowNull: false },
      feedingAt: { type: DataTypes.DATE, allowNull: false },
      amountMl: { type: DataTypes.FLOAT, allowNull: false },
      sourceCode: { type: DataTypes.STRING(20), allowNull: false },
      moodTags: { type: DataTypes.JSON, allowNull: true },
      note: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: "ChildMilkLog",
      tableName: "ChildMilkLogs",
    }
  );

  return ChildMilkLog;
};