'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'guest' to the enum type
    await queryInterface.sequelize.query(`
      ALTER TYPE enum_workspace_members_role ADD VALUE IF NOT EXISTS 'guest';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Note: Postgres doesn't allow removing enum values easily
    // You would need to recreate the enum if you want to remove 'guest'
    console.log('Down migration not implemented for removing enum values.');
  }
};
