import { ItemEnumTypes } from '@/domain/models'
import { db } from '@/main/config/database'
import { DataTypes } from 'sequelize'

import { UserSchema } from './User'

export const ItemSchema = db.define(
  'item',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    _id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'user',
        key: '_id',
      },
    },
    name: DataTypes.ENUM({
      values: [
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ],
    }),
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'item',
  }
)

UserSchema.hasMany(ItemSchema)
// ItemSchema.belongsTo(UserSchema)
