"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PostVotes", {
      post_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, _) {
    await queryInterface.dropTable("PostVotes");
  },
};
