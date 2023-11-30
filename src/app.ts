import express, { json, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'http';

import connectDB from './DBconnect';
import { authRouter, categoryRouter } from './routes';
import { verifyJWT, errorHandler, HttpException } from './middleware';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;
let server: Server;

app.use(json());

app.use('/auth', authRouter);

app.use(verifyJWT);

app.use('/categories', categoryRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.get('/*', (req: Request, res: Response, next: NextFunction) => {
  throw new HttpException(404, 'Page not found');
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to Mongo DB');
  server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

