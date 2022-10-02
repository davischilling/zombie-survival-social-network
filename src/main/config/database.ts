import { Sequelize } from 'sequelize'

const dbUser = process.env.POSTGRES_USER
const dbPassword = process.env.POSTGRES_PASSWORD

if (!dbUser) {
  throw new Error('empty_dbUser')
}

export const sequelize = new Sequelize(
  'postgres', // db name,
  dbUser, // username
  dbPassword, // password
  {
    host: 'localhost',
    dialect: 'postgres',
    // pool: {
    //   max: 5,
    //   min: 0,
    //   require: 30000,
    //   idle: 10000,
    // },
    // logging: false,
  }
)
