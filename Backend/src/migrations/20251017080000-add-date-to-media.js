"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Media", "date", {
      type: Sequelize.DATEONLY,
      allowNull: false,
      // Dòng đã được thay đổi ở đây
      defaultValue: Sequelize.NOW,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Media", "date");
  },
};