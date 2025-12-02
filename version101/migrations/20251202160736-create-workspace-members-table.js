//create-workspace-members-table.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workspace_members', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      workspace_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM('admin', 'member', 'guest'),
        allowNull: false,
        defaultValue: 'member'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('workspace_members', ['user_id', 'workspace_id'], {
      unique: true,
      name: 'workspace_members_user_workspace_unique'
    });
    await queryInterface.addIndex('workspace_members', ['workspace_id']);
    await queryInterface.addIndex('workspace_members', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workspace_members');
  }
};
