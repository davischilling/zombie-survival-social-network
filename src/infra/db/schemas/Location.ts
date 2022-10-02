import { sequelize } from '@/main/config/database'
import { DataTypes } from 'sequelize'

import UserSchema from './User'

const LocationSchema = sequelize.define(
  'Location',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    latitude: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
)

// LocationSchema.belongsTo(UserSchema, {
//   foreignKey: 'userId',
//   targetKey: 'id',
// })

UserSchema.hasOne(LocationSchema, {
  foreignKey: 'userId',
  sourceKey: 'id',
})

export default LocationSchema
