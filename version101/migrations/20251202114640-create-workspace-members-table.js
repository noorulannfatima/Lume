// migrations/XXXXXXXXXXXXXX-create-workspace-members-table.js
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
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      workspaceId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'workspace_id',
        references: {
          model: 'workspaces',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM('admin', 'member'),
        allowNull: false,
        defaultValue: 'member'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    });

    await queryInterface.addIndex('workspace_members', ['user_id', 'workspace_id'], {
      unique: true,
      name: 'workspace_members_user_workspace_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workspace_members');
  }
};