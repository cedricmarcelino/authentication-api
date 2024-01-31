import express, { Express, Request, Response } from 'express';

const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const cookieParser = require('cookie-parser');


const app: Express = express()


app.use(express.json()) // for parsing application/json
app.use(cookieParser())

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/users', userRoutes);
app.use(authRoutes)

app.listen(3000, () => {
  console.log(`[server]: Server is running at http://localhost:3000`);
});