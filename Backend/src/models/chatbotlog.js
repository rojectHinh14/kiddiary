"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChatbotLog extends Model {
    static associate(models) {
      // Liên kết với User
      ChatbotLog.belongsTo(models.User, { 
        foreignKey: "userId",
        as: "user" 
      });
    }
  }
  
  ChatbotLog.init(
    {
      userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: "ChatbotLog",
      tableName: "ChatbotLogs",
      freezeTableName: true,
      timestamps: true, // createdAt, updatedAt
    }
  );
  
  return ChatbotLog;
};