"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Users", "googleId").catch(() => {});
    await queryInterface.removeIndex("Users", "facebookId").catch(() => {});
    await queryInterface.removeIndex("Users", "githubId").catch(() => {});

    await queryInterface.changeColumn("Users", "googleId", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });

    await queryInterface.changeColumn("Users", "facebookId", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });

    await queryInterface.changeColumn("Users", "githubId", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // không cần rollback
  },
};
