// models/Reaction.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface ReactionAttributes {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReactionCreationAttributes extends Optional<ReactionAttributes, 'id'> {}

class Reaction extends Model<ReactionAttributes, ReactionCreationAttributes> implements ReactionAttributes {
  declare id: string;
  declare messageId: string;
  declare userId: string;
  declare emoji: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Reaction.init(
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
    emoji: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'reactions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['messageId', 'userId', 'emoji'],
      },
    ],
  }
);
