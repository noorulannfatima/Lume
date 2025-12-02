// models/DirectMessage.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface DirectMessageAttributes {
  id: string;
  workspaceId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DirectMessageCreationAttributes extends Optional<DirectMessageAttributes, 'id'> {}

class DirectMessage extends Model<DirectMessageAttributes, DirectMessageCreationAttributes> implements DirectMessageAttributes {
  declare id: string;
  declare workspaceId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

DirectMessage.init(
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
  },
  {
    sequelize,
    tableName: 'direct_messages',
    timestamps: true,
  }
);

export default DirectMessage;