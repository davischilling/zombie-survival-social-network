import { Sequelize } from 'sequelize'

const dbConnection = () => {
  if (process.env.NODE_ENV === 'test') {
    const memoryDb = new Sequelize('sqlite::memory:')
    return memoryDb
  }
  const sqliteDb = new Sequelize({
    dialect: 'sqlite',
    storage: './zssn_db.sqlite',
  })
  return sqliteDb
}

export const db = dbConnection()
