import './main/config/module-alias'
import { app } from '@/main/config/app'
import { Express } from 'express'

const start = async (app: Express): Promise<void> => {
  const port = process.env.PORT

  try {
    app.listen(port, () => {
      console.log(`Running server on port ${port}`)
    })
  } catch (err) {
    console.log(err)
  }
}

start(app)
