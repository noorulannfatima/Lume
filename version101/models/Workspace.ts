// models/Workspace.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface WorkspaceAttributes {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WorkspaceCreationAttributes extends Optional<WorkspaceAttributes, 'id' | 'icon' | 'description'> {}

class Workspace extends Model<WorkspaceAttributes, WorkspaceCreationAttributes> implements WorkspaceAttributes {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare icon: string | null;
  declare description: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Workspace.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'workspaces',
    timestamps: true,
    underscored: true,
  }
);

export default Workspace;
