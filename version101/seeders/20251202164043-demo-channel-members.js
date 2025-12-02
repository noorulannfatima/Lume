// demo-channel-members.js
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const channels = await queryInterface.sequelize.query(
      'SELECT id, name, workspace_id FROM channels ORDER BY created_at',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const workspaceMembers = await queryInterface.sequelize.query(
      'SELECT user_id, workspace_id FROM workspace_members',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (channels.length > 0 && workspaceMembers.length > 0) {
      const channelMembers = [];

      // Add all workspace members to general channels
      for (const channel of channels) {
        if (channel.name === 'general') {
          const workspaceMembersForChannel = workspaceMembers.filter(
            wm => wm.workspace_id === channel.workspace_id
          );

          for (const wm of workspaceMembersForChannel) {
            channelMembers.push({
              id: uuidv4(),
              channel_id: channel.id,
              user_id: wm.user_id,
              last_read_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
              notification_preference: 'all',
              created_at: new Date(),
              updated_at: new Date()
            });
          }
        }
      }

      // Add some members to other channels
      for (const channel of channels) {
        if (channel.name !== 'general') {
          const workspaceMembersForChannel = workspaceMembers.filter(
            wm => wm.workspace_id === channel.workspace_id
          );

          // Add 1-2 random members
          const membersToAdd = workspaceMembersForChannel.slice(0, Math.floor(Math.random() * 2) + 1);
          
          for (const wm of membersToAdd) {
            // Check if already added
            const exists = channelMembers.some(
              cm => cm.channel_id === channel.id && cm.user_id === wm.user_id
            );

            if (!exists) {
              channelMembers.push({
                id: uuidv4(),
                channel_id: channel.id,
                user_id: wm.user_id,
                last_read_at: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000),
                notification_preference: Math.random() > 0.5 ? 'all' : 'mentions',
                created_at: new Date(),
                updated_at: new Date()
              });
            }
          }
        }
      }

      if (channelMembers.length > 0) {
        await queryInterface.bulkInsert('channel_members', channelMembers, {});
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('channel_members', null, {});
  }
};
