import express, { json, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './DBconnect';
import { authRouter, categoryRouter, accountRouter, operationRouter } from './routes';
import { verifyJWT, errorHandler, HttpException } from './middleware';

dotenv.config();
connectDB();

const allowedOrigins = ['http://localhost:4200'];

const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
};

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
}

const app = express();
const port = process.env.PORT || 3000;

app.use(credentials);

app.use(cors(corsOptions));

app.use(json());

app.use('/auth', authRouter);

app.use(verifyJWT);

app.use('/categories', categoryRouter);

app.use('/accounts', accountRouter);

app.use('/operations', operationRouter);

app.get('/*', (req: Request, res: Response, next: NextFunction) => {
  throw new HttpException(404, 'Page not found');
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to Mongo DB');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});

