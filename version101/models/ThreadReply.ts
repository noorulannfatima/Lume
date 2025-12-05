// models/ThreadReply.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface ThreadReplyAttributes {
  id: string;
  messageId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ThreadReplyCreationAttributes extends Optional<ThreadReplyAttributes, 'id' | 'isEdited' | 'deletedAt'> {}

class ThreadReply extends Model<ThreadReplyAttributes, ThreadReplyCreationAttributes> implements ThreadReplyAttributes {
  declare id: string;
  declare messageId: string;
  declare userId: string;
  declare content: string;
  declare isEdited: boolean;
  declare deletedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ThreadReply.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    messageId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    isEdited: {
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
    tableName: 'thread_replies',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        fields: ['messageId', 'createdAt'],
      },
      {
        fields: ['userId'],
      },
    ],
  }
);

export default ThreadReply;