"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Media", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      albumId: { type: Sequelize.INTEGER, allowNull: false },
      childId: { type: Sequelize.INTEGER },
      fileUrl: { type: Sequelize.TEXT },
      fileTypeCode: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      aiTags: { type: Sequelize.JSON },
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Media");
  },
};
