import { NextFunction, Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, Account } from '../models';
import { HttpException } from '../middleware';

const handleNewUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) {
    throw new HttpException(409, `The account with email ${email} already exists`);
  }
  try {
    const hashedPassword = await hash(password, process.env.SALT || 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    await Account.create({ userId: newUser._id, name: 'Гаманець', mandatory: true });
    return res.status(201).json({ message: `New user ${username} successfully created!` });
  } catch (err) {
    next(err);
  }
};

const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).exec();
    if (!foundUser) throw new HttpException(401, 'Wrong email!');
    const match = await compare(password, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        { email: foundUser.email },
        process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
        {
          expiresIn: '1d',
        },
      );
      res.json({ username: foundUser.username, token: accessToken });
    } else {
      throw new HttpException(401, 'Wrong password!');
    }
  } catch (err) {
    next(err);
  }
};

export { handleNewUser, handleLogin };
