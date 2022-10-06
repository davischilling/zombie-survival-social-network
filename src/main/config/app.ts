import express from 'express'
import swaggerIi from 'swagger-ui-express'

import { apiRoutes } from './routes'
import swaggerFile from './swagger.json'

const app = express()

app.use(express.json())
app.use('/zssn-docs', swaggerIi.serve, swaggerIi.setup(swaggerFile))

apiRoutes(app)

export { app }
