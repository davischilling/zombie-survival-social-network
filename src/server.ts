import express, { Express } from 'express'

const app = express()

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
