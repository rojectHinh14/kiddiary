"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ChildSleepLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      childId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ChildProfiles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      sleepDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      endTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      duration: {
        type: Sequelize.INTEGER, // minutes
        allowNull: true,
      },

      quality: {
        type: Sequelize.ENUM("GOOD", "FUSSY", "STARTLED"),
        allowNull: false,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ChildSleepLogs");
  },
};
