import './main/config/module-alias'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import { Express } from 'express'

const start = async (app: Express): Promise<void> => {
  const apiPort = process.env.PORT

  try {
    await db.sync()
    console.log('Connection has been established successfully.')
    app.listen(apiPort, () => {
      console.log(`Running server on port ${apiPort}`)
    })
  } catch (err) {
    console.log(err)
  }
}

start(app)
