// demo-workspace-members.js
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id, email FROM users ORDER BY created_at',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const workspaces = await queryInterface.sequelize.query(
      'SELECT id, slug FROM workspaces ORDER BY created_at',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length > 0 && workspaces.length > 0) {
      const members = [
        // Acme Corporation workspace
        {
          id: uuidv4(),
          user_id: users[0].id, // john
          workspace_id: workspaces[0].id,
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          user_id: users[1].id, // jane
          workspace_id: workspaces[0].id,
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          user_id: users[2].id, // bob
          workspace_id: workspaces[0].id,
          role: 'member',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          user_id: users[3].id, // alice
          workspace_id: workspaces[0].id,
          role: 'guest',
          created_at: new Date(),
          updated_at: new Date()
        },
        // Marketing Team workspace
        {
          id: uuidv4(),
          user_id: users[1].id, // jane
          workspace_id: workspaces[1].id,
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          user_id: users[3].id, // alice
          workspace_id: workspaces[1].id,
          role: 'member',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          user_id: users[4].id, // charlie
          workspace_id: workspaces[1].id,
          role: 'member',
          created_at: new Date(),
          updated_at: new Date()
        },
        // Dev Squad workspace
        {
          id: uuidv4(),
          user_id: users[0].id, // john
          workspace_id: workspaces[2].id,
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          user_id: users[2].id, // bob
          workspace_id: workspaces[2].id,
          role: 'member',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('workspace_members', members, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('workspace_members', null, {});
  }
};