// create-messages-table.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      channel_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'channels',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      direct_message_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'direct_messages',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      thread_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'messages',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      attachments: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      is_edited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_pinned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex('messages', ['channel_id', 'created_at']);
    await queryInterface.addIndex('messages', ['direct_message_id', 'created_at']);
    await queryInterface.addIndex('messages', ['thread_id']);
    await queryInterface.addIndex('messages', ['user_id']);
    await queryInterface.addIndex('messages', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  }
};