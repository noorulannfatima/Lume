create-direct-message-members-table.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('direct_message_members', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      direct_message_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'direct_messages',
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('direct_message_members', ['direct_message_id', 'user_id'], {
      unique: true,
      name: 'dm_members_dm_user_unique'
    });
    await queryInterface.addIndex('direct_message_members', ['user_id']);
    await queryInterface.addIndex('direct_message_members', ['direct_message_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('direct_message_members');
  }
};