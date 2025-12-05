// models/Message.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface MessageAttributes {
  id: string;
  channelId: string | null;
  directMessageId: string | null;
  threadId: string | null;
  userId: string;
  content: string;
  attachments: object | null;
  isEdited: boolean;
  isPinned: boolean;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'channelId' | 'directMessageId' | 'threadId' | 'attachments' | 'isEdited' | 'isPinned' | 'deletedAt'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  declare id: string;
  declare channelId: string | null;
  declare directMessageId: string | null;
  declare threadId: string | null;
  declare userId: string;
  declare content: string;
  declare attachments: object | null;
  declare isEdited: boolean;
  declare isPinned: boolean;
  declare deletedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    directMessageId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'direct_messages',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    threadId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'messages',
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        fields: ['channelId', 'createdAt'],
      },
      {
        fields: ['directMessageId', 'createdAt'],
      },
      {
        fields: ['threadId'],
      },
    ],
  }
);

export default Message;