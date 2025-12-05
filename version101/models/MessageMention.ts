// models/MessageMention.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface MessageMentionAttributes {
  id: string;
  messageId: string;
  userId: string;
  mentionedUserId: string;
  createdAt?: Date;
}

interface MessageMentionCreationAttributes extends Optional<MessageMentionAttributes, 'id'> {}

class MessageMention extends Model<MessageMentionAttributes, MessageMentionCreationAttributes> implements MessageMentionAttributes {
  declare id: string;
  declare messageId: string;
  declare userId: string;
  declare mentionedUserId: string;
  declare readonly createdAt: Date;
}

MessageMention.init(
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
      comment: 'User who sent the message with mention',
    },
    mentionedUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      comment: 'User who was mentioned',
    },
  },
  {
    sequelize,
    tableName: 'message_mentions',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['messageId', 'mentionedUserId'],
      },
      {
        fields: ['mentionedUserId', 'createdAt'],
      },
    ],
  }
);

export default MessageMention;