
// models/WorkspaceMember.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';
import User from './User';
import Workspace from './Workspace';

interface WorkspaceMemberAttributes {
  id: string;
  userId: string;
  workspaceId: string;
  role: 'admin' | 'member';
  createdAt?: Date;
  updatedAt?: Date;
}

interface WorkspaceMemberCreationAttributes extends Optional<WorkspaceMemberAttributes, 'id' | 'role'> {}

class WorkspaceMember extends Model<WorkspaceMemberAttributes, WorkspaceMemberCreationAttributes> implements WorkspaceMemberAttributes {
  declare id: string;
  declare userId: string;
  declare workspaceId: string;
  declare role: 'admin' | 'member';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WorkspaceMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workspaces',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    role: {
      type: DataTypes.ENUM('admin', 'member'),
      allowNull: false,
      defaultValue: 'member',
    },
  },
  {
    sequelize,
    tableName: 'workspace_members',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'workspaceId'],
      },
    ],
  }
);

// Define associations
User.belongsToMany(Workspace, {
  through: WorkspaceMember,
  foreignKey: 'userId',
  otherKey: 'workspaceId',
  as: 'workspaces',
});

Workspace.belongsToMany(User, {
  through: WorkspaceMember,
  foreignKey: 'workspaceId',
  otherKey: 'userId',
  as: 'members',
});

WorkspaceMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WorkspaceMember.belongsTo(Workspace, { foreignKey: 'workspaceId', as: 'workspace' });

export default WorkspaceMember;
