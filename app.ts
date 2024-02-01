import express, { Express, Request, Response } from 'express';
import { requestLogger } from './utils/loggerFactory'
import { setup, SwaggerOptions, serve } from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc';
import { PORT } from './utils/constants';
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const logger = require('pino')();

// TO DO:
// Configure Swagger UI
// Add pagination for all users
// Fix error handling for bad json format - express.json()
// Fix hard coded port and hosts
// Transfer secret to environment when deploying

const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: `This is an authentication REST API and this is the first REST API I've made with NodeJS/Express.`
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ],
  },
  apis: ["./routes/*.js"] // change to .ts when developing on local machine
}

const specs = swaggerJSDoc(options)

const app: Express = express()

app.use(express.json())
app.use(cookieParser())
app.use(requestLogger);

app.use('/explorer', serve, setup(specs));

app.use('/users', userRoutes);
app.use(authRoutes)

app.listen(3000, () => {
  logger.info(`Server is listening on port ${PORT}`);
});