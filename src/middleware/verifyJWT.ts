import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, NextFunction, Response } from 'express';
import { UserRequest } from '../models';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  authHeader = authHeader.replace('Bearer ', '');
  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, (err, decoded) => {
    if (err) {
      console.log(err);
      if (err.name === 'TokenExpiredError') return res.sendStatus(401);
      return res.sendStatus(403);
    }
    (req as UserRequest).user = (decoded as JwtPayload).email;
    next();
  });
};

export default verifyJWT;
