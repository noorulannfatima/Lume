// seeders/XXXXXXXXXXXXXX-demo-workspaces.js
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('workspaces', [
      {
        id: uuidv4(),
        name: 'My First Workspace',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Team Workspace',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Personal Projects',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('workspaces', null, {});
  }
};