import { Request, Response, NextFunction, response } from 'express';
import { ValidationError } from 'express-validator';
import logger from './logger';

export class HttpException extends Error {
  public status: number;
  public message: string;
  public details: string | ValidationError[];

  constructor(status: number, message: string, details?: string | ValidationError[]) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details || '';
  }
};

export const errorHandler = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const details = error.details;
  let message = error.message;

  if (status >= 500) {
    console.log(`message: ${message} details: ${details}`);
    logger.error(`message: ${message} details: ${details}`);
    message = 'Internal server error';
  };
  return res.status(status).json({ message, details });
};
