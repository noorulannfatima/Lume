// models/DirectMessageMember.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface DirectMessageMemberAttributes {
  id: string;
  directMessageId: string;
  userId: string;
  lastReadAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DirectMessageMemberCreationAttributes extends Optional<DirectMessageMemberAttributes, 'id' | 'lastReadAt'> {}

class DirectMessageMember extends Model<DirectMessageMemberAttributes, DirectMessageMemberCreationAttributes> implements DirectMessageMemberAttributes {
  declare id: string;
  declare directMessageId: string;
  declare userId: string;
  declare lastReadAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

DirectMessageMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    directMessageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'direct_messages',
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
  },
  {
    sequelize,
    tableName: 'direct_message_members',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['directMessageId', 'userId'],
      },
    ],
  }
);

export default DirectMessageMember;
