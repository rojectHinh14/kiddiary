"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AllCodes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      keyMap: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      valueEn: { type: Sequelize.STRING },
      valueVi: { type: Sequelize.STRING },
      orderBy: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable("AllCodes");
  },
};
