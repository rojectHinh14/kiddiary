"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatbotLog extends Model {
    static associate(models) {}
  }
  ChatbotLog.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      question: DataTypes.TEXT,
      answer: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ChatbotLog",
      tableName: "ChatbotLogs",
    }
  );
  return ChatbotLog;
};
