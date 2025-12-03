// models/index.ts
import sequelize from '@/lib/database';
import User from './User';
import Workspace from './Workspace';
import WorkspaceMember from './WorkspaceMember';
import Channels from './Channels';

// Initialize all models and their associations
const models = {
  User,
  Workspace,
  WorkspaceMember,
  Channels,
};

// Define associations
// WorkspaceMember belongs to Workspace
WorkspaceMember.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace',
});

// WorkspaceMember belongs to User
WorkspaceMember.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Workspace has many WorkspaceMembers
Workspace.hasMany(WorkspaceMember, {
  foreignKey: 'workspaceId',
  as: 'members',
});

// User has many WorkspaceMembers
User.hasMany(WorkspaceMember, {
  foreignKey: 'userId',
  as: 'workspaceMemberships',
});

// Channels belongs to Workspace
Channels.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace',
});

// Channels belongs to User (creator)
Channels.belongsTo(User, {
  foreignKey: 'createdById',
  as: 'creator',
});

// Workspace has many Channels
Workspace.hasMany(Channels, {
  foreignKey: 'workspaceId',
  as: 'channels',
});

// User has many Channels (as creator)
User.hasMany(Channels, {
  foreignKey: 'createdById',
  as: 'createdChannels',
});

// Sync database (only in development)
export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export { sequelize, User, Workspace, WorkspaceMember, Channels };
export default models;
