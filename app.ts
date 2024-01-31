import express, { Express, Request, Response } from 'express';
import { requestLogger } from './utils/loggerFactory'
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const logger = require('pino')();
const app: Express = express()

// Fix error handling for bad json format

app.use(express.json())
app.use(cookieParser())
app.use(requestLogger);

app.get('/', (_req: Request, res: Response) => {
  res.send('Route for Swagger UI');
});

app.use('/users', userRoutes);
app.use(authRoutes)

app.listen(3000, () => {
  logger.info(`Server is listening on port 3000`);
});