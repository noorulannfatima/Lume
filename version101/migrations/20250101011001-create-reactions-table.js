// create-files-table.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('files', {
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
      message_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'messages',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mime_type: {
        type: Sequelize.STRING,
        allowNull: false
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

    await queryInterface.addIndex('files', ['workspace_id']);
    await queryInterface.addIndex('files', ['message_id']);
    await queryInterface.addIndex('files', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('files');
  }
};