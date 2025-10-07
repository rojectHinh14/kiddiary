"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductSuggestions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mediaId: { type: Sequelize.INTEGER, allowNull: false },
      productName: { type: Sequelize.STRING },
      productUrl: { type: Sequelize.TEXT },
      categoryCode: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("ProductSuggestions");
  },
};
