// models/index.ts
import sequelize from '@/lib/database';
import User from './User';
import Workspace from './Workspace';
import WorkspaceMember from './WorkspaceMember';

// Initialize all models and their associations
const models = {
  User,
  Workspace,
  WorkspaceMember,
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

export { sequelize, User, Workspace, WorkspaceMember };
export default models;
