// models/Channel.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface ChannelAttributes {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  isPrivate: boolean;
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChannelCreationAttributes extends Optional<ChannelAttributes, 'id' | 'description' | 'isPrivate'> {}

class Channel extends Model<ChannelAttributes, ChannelCreationAttributes> implements ChannelAttributes {
  declare id: string;
  declare workspaceId: string;
  declare name: string;
  declare description: string | null;
  declare isPrivate: boolean;
  declare createdById: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Channel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'channels',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['workspaceId', 'name'],
      },
    ],
  }
);

export default Channel;