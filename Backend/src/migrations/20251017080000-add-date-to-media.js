"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.addColumn("Media", "date", {
  type: Sequelize.DATE,
  allowNull: false,
  defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Media", "date");
  },
};