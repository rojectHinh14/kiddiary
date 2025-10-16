"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Media", "date", {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.fn("CURDATE"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Media", "date");
  },
};
