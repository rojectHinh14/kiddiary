"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ChildMilkLogs", {
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
      feedingAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      amountMl: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      sourceCode: {
        type: Sequelize.STRING(20),
        allowNull: false, // 'BREAST' | 'BOTTLE'
      },
      moodTags: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("ChildMilkLogs", ["childId", "feedingAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ChildMilkLogs");
  },
};
