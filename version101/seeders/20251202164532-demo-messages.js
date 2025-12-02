// demo-reactions.js
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const messages = await queryInterface.sequelize.query(
      'SELECT id FROM messages ORDER BY created_at LIMIT 5',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 3',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (messages.length > 0 && users.length > 0) {
      const reactions = [
        {
          id: uuidv4(),
          message_id: messages[0].id,
          user_id: users[0].id,
          emoji: '👍',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          message_id: messages[0].id,
          user_id: users[1].id,
          emoji: '👍',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          message_id: messages[0].id,
          user_id: users[2].id,
          emoji: '🎉',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          message_id: messages[1].id,
          user_id: users[0].id,
          emoji: '🔥',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          message_id: messages[2].id,
          user_id: users[1].id,
          emoji: '✅',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          message_id: messages[3].id,
          user_id: users[0].id,
          emoji: '😍',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          message_id: messages[3].id,
          user_id: users[2].id,
          emoji: '😍',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('reactions', reactions, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reactions', null, {});
  }
};