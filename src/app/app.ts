import express, { Express, Request, Response, NextFunction } from 'express';
import { requestLogger } from './utils/loggerFactory'
import { setup, SwaggerOptions, serve } from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc';
import { PORT } from './utils/constants';
import { db } from './db';
import { responseError } from './utils/response';
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const logger = require('pino')();

// TO DO:
// Try to deploy dockerized application with DB
// Fix hard coded port and hosts
// Transfer initiating of table into docker compose?
// Store JWT Secret better?

interface ISyntaxError extends SyntaxError {
  status: number
}

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
  apis: ["./routes/*.ts"]
}

const initiateTables = async () => {
  await db.initTable.users();
}

const specs = swaggerJSDoc(options)

const app: Express = express()
initiateTables();
app.use(express.json())

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && (err as ISyntaxError).status === 400 && 'body' in err) {
    const response = responseError(err.message)
    logger.error(`Invalid JSON format.`);
    return res.status(400).send(response);
  }
  next();
});

app.use(cookieParser())
app.use(requestLogger);

app.use('/explorer', serve, setup(specs));

app.use('/users', userRoutes);
app.use(authRoutes)

app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});