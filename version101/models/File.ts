// models/File.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface FileAttributes {
  id: string;
  userId: string;
  workspaceId: string;
  messageId: string | null;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FileCreationAttributes extends Optional<FileAttributes, 'id' | 'messageId'> {}

class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  declare id: string;
  declare userId: string;
  declare workspaceId: string;
  declare messageId: string | null;
  declare name: string;
  declare url: string;
  declare size: number;
  declare mimeType: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

File.init(
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
    messageId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'files',
    timestamps: true,
    indexes: [
      {
        fields: ['workspaceId'],
      },
      {
        fields: ['messageId'],
      },
    ],
  }
);

export default File;