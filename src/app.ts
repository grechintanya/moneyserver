import express, { json, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import connectDB from './DBconnect';
import { authRouter, categoryRouter } from './routes';
import verifyJWT from './middleware/verifyJWT';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(json());

app.use('/auth', authRouter);

app.use(verifyJWT);

app.use('/categories', categoryRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.get('/*', (req: Request, res: Response) => {
  res.status(404);
});

mongoose.connection.once('open', () => {
  console.log('Connected to Mongo DB');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
