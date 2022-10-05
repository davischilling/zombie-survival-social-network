import { SexEnumTypes } from '@/domain/models'
import { db } from '@/main/config/database'
import { DataTypes } from 'sequelize'

export const UserSchema = db.define(
  'user',
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
      values: [SexEnumTypes.male, SexEnumTypes.female],
    },
    isInfected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    tableName: 'user',
  }
)
