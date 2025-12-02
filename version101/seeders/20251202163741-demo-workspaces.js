// demo-workspaces.js
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const workspaces = [
      {
        id: uuidv4(),
        name: 'Acme Corporation',
        slug: 'acme-corp',
        icon: 'https://ui-avatars.com/api/?name=Acme+Corporation&size=256',
        description: 'Main workspace for Acme Corporation team collaboration',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Marketing Team',
        slug: 'marketing-team',
        icon: 'https://ui-avatars.com/api/?name=Marketing+Team&size=256',
        description: 'Workspace for marketing campaigns and strategy',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Dev Squad',
        slug: 'dev-squad',
        icon: 'https://ui-avatars.com/api/?name=Dev+Squad&size=256',
        description: 'Engineering and development workspace',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await queryInterface.bulkInsert('workspaces', workspaces, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('workspaces', null, {});
  }
};