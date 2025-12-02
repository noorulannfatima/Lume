// demo-channels.js
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const workspaces = await queryInterface.sequelize.query(
      'SELECT id, slug FROM workspaces ORDER BY created_at',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users ORDER BY created_at LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (workspaces.length > 0 && users.length > 0) {
      const channels = [
        // Acme Corporation channels
        {
          id: uuidv4(),
          workspace_id: workspaces[0].id,
          name: 'general',
          description: 'Company-wide announcements and general discussion',
          is_private: false,
          created_by_id: users[0].id,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          workspace_id: workspaces[0].id,
          name: 'random',
          description: 'Non-work banter and water cooler conversation',
          is_private: false,
          created_by_id: users[0].id,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          workspace_id: workspaces[0].id,
          name: 'engineering',
          description: 'Engineering discussions and technical topics',
          is_private: false,
          created_by_id: users[0].id,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          workspace_id: workspaces[0].id,
          name: 'leadership',
          description: 'Private channel for company leadership',
          is_private: true,
          created_by_id: users[0].id,
          created_at: new Date(),
          updated_at: new Date()
        },
        // Marketing Team channels
        {
          id: uuidv4(),
          workspace_id: workspaces[1].id,
          name: 'general',
          description: 'Marketing team general discussion',
          is_private: false,
          created_by_id: users[0].id,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          workspace_id: workspaces[1].id,
          name: 'campaigns',
          description: 'Campaign planning and execution',
          is_private: false,
          created_by_id: users[0].id,
          created_at: new Date(),
          updated_at: new Date()
        },
        // Dev Squad channels
        {
          id: uuidv4(),
          workspace_id: workspaces[2].id,
          name: 'general',
          description: 'Dev Squad general discussion',
          is_private: false,
          created_by_id: users[0].id,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          workspace_id: workspaces[2].id,
          name: 'code-review',
          description: 'Code reviews and pull request discussions',
          is_private: false,
          created_by_id: users[0].id,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('channels', channels, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('channels', null, {});
  }
};