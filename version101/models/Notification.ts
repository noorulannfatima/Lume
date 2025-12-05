// models/Notification.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface NotificationAttributes {
  id: string;
  userId: string;
  workspaceId: string;
  channelId: string | null;
  messageId: string | null;
  threadReplyId: string | null;
  type: 'mention' | 'reply' | 'reaction' | 'dm' | 'channel_invite' | 'workspace_invite';
  title: string;
  content: string | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'channelId' | 'messageId' | 'threadReplyId' | 'content' | 'isRead' | 'readAt'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  declare id: string;
  declare userId: string;
  declare workspaceId: string;
  declare channelId: string | null;
  declare messageId: string | null;
  declare threadReplyId: string | null;
  declare type: 'mention' | 'reply' | 'reaction' | 'dm' | 'channel_invite' | 'workspace_invite';
  declare title: string;
  declare content: string | null;
  declare isRead: boolean;
  declare readAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Notification.init(
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
    channelId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'channels',
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
      onDelete: 'CASCADE',
    },
    threadReplyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'thread_replies',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('mention', 'reply', 'reaction', 'dm', 'channel_invite', 'workspace_invite'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['userId', 'isRead', 'createdAt'],
      },
      {
        fields: ['workspaceId'],
      },
      {
        fields: ['messageId'],
      },
    ],
  }
);

export default Notification;