// seeders/XXXXXXXXXXXXXX-demo-workspace-members.js
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, get users and workspaces
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 3',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const workspaces = await queryInterface.sequelize.query(
      'SELECT id FROM workspaces LIMIT 3',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length > 0 && workspaces.length > 0) {
      await queryInterface.bulkInsert('workspace_members', [
        {
          id: uuidv4(),
          user_id: users[0].id,
          workspace_id: workspaces[0].id,
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          user_id: users[1].id,
          workspace_id: workspaces[0].id,
          role: 'member',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          user_id: users[0].id,
          workspace_id: workspaces[1].id,
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('workspace_members', null, {});
  }
};