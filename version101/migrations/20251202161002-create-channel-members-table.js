// create-channel-members-table.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('channel_members', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      channel_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'channels',
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
      last_read_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notification_preference: {
        type: Sequelize.ENUM('all', 'mentions', 'none'),
        defaultValue: 'all',
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

    await queryInterface.addIndex('channel_members', ['channel_id', 'user_id'], {
      unique: true,
      name: 'channel_members_channel_user_unique'
    });
    await queryInterface.addIndex('channel_members', ['user_id']);
    await queryInterface.addIndex('channel_members', ['channel_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('channel_members');
  }
};
