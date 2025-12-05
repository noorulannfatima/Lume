// models/DirectMessageConversation.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface DirectMessageConversationAttributes {
  id: string;
  workspaceId: string;
  isGroup: boolean;
  name: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DirectMessageConversationCreationAttributes extends Optional<DirectMessageConversationAttributes, 'id' | 'isGroup' | 'name'> {}

class DirectMessageConversation extends Model<DirectMessageConversationAttributes, DirectMessageConversationCreationAttributes> implements DirectMessageConversationAttributes {
  declare id: string;
  declare workspaceId: string;
  declare isGroup: boolean;
  declare name: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

DirectMessageConversation.init(
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
    isGroup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'True if conversation has more than 2 participants',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Optional name for group DMs',
    },
  },
  {
    sequelize,
    tableName: 'direct_message_conversations',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['workspaceId'],
      },
    ],
  }
);

export default DirectMessageConversation;