// demo-users.js
'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        id: uuidv4(),
        email: 'john@example.com',
        name: 'John Doe',
        password: hashedPassword,
        email_verified: new Date(),
        status: 'online',
        status_text: 'Working on the new feature',
        timezone: 'America/New_York',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: hashedPassword,
        email_verified: new Date(),
        status: 'away',
        status_text: 'In a meeting',
        timezone: 'America/Los_Angeles',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'bob@example.com',
        name: 'Bob Johnson',
        password: hashedPassword,
        email_verified: new Date(),
        status: 'offline',
        status_text: null,
        timezone: 'Europe/London',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'alice@example.com',
        name: 'Alice Williams',
        password: hashedPassword,
        email_verified: new Date(),
        status: 'online',
        status_text: '🎉 Celebrating launch day!',
        timezone: 'Asia/Tokyo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'charlie@example.com',
        name: 'Charlie Brown',
        password: hashedPassword,
        email_verified: null,
        status: 'offline',
        status_text: null,
        timezone: 'Australia/Sydney',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};