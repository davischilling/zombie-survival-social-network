import express from 'express'
import swaggerIi from 'swagger-ui-express'

import swaggerFile from './swagger.json'

const app = express()

app.use(express.json())
app.use('/api-docs', swaggerIi.serve, swaggerIi.setup(swaggerFile))

export { app }
