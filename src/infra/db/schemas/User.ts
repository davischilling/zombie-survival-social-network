import { ItemEnumTypes, SexEnumTypes } from '@/domain/models'
import { sequelize } from '@/main/config/database'
import { DataTypes } from 'sequelize'

const UserSchema = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    sex: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [SexEnumTypes.male, SexEnumTypes.male],
    },
    items: {
      type: DataTypes.ARRAY(DataTypes.ENUM<ItemEnumTypes>()),
      allowNull: false,
    },
    isInfected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
)

export default UserSchema
