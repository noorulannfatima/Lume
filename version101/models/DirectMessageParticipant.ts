// models/DirectMessageParticipant.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface DirectMessageParticipantAttributes {
  id: string;
  conversationId: string;
  userId: string;
  lastReadAt: Date | null;
  joinedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DirectMessageParticipantCreationAttributes extends Optional<DirectMessageParticipantAttributes, 'id' | 'lastReadAt' | 'joinedAt'> {}

class DirectMessageParticipant extends Model<DirectMessageParticipantAttributes, DirectMessageParticipantCreationAttributes> implements DirectMessageParticipantAttributes {
  declare id: string;
  declare conversationId: string;
  declare userId: string;
  declare lastReadAt: Date | null;
  declare joinedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

DirectMessageParticipant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'direct_message_conversations',
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
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'direct_message_participants',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['conversationId', 'userId'],
      },
      {
        fields: ['userId'],
      },
    ],
  }
);

export default DirectMessageParticipant;