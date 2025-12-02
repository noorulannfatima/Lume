// models/ChannelMember.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface ChannelMemberAttributes {
  id: string;
  channelId: string;
  userId: string;
  lastReadAt: Date | null;
  notificationPreference: 'all' | 'mentions' | 'none';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChannelMemberCreationAttributes extends Optional<ChannelMemberAttributes, 'id' | 'lastReadAt' | 'notificationPreference'> {}

class ChannelMember extends Model<ChannelMemberAttributes, ChannelMemberCreationAttributes> implements ChannelMemberAttributes {
  declare id: string;
  declare channelId: string;
  declare userId: string;
  declare lastReadAt: Date | null;
  declare notificationPreference: 'all' | 'mentions' | 'none';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ChannelMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    channelId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'channels',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    lastReadAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notificationPreference: {
      type: DataTypes.ENUM('all', 'mentions', 'none'),
      defaultValue: 'all',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'channel_members',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['channelId', 'userId'],
      },
    ],
  }
);

export default ChannelMember;