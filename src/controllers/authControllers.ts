import { Request, Response } from 'express';
import { hash } from 'bcrypt';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//import dotenv from 'dotenv';

import { User, Account } from '../models';

//dotenv.config();

const handleNewUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required!');
  }
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) {
    return res.status(409).send(`The account with email ${email} already exists`);
  }
  try {
    const hashedPassword = await hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    await Account.create({ userID: newUser._id, name: 'Гаманець' });
    return res.status(201).json({ message: `New user ${username} successfully created!` });
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
};

const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Email and password are required');
  const foundUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).exec();
  if (!foundUser) return res.status(401).send('Wrong email!');
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      { email: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
      {
        expiresIn: '30m',
      },
    );
    res.json({ token: accessToken });
  } else {
    res.status(401).send('Wrong password!');
  }
};

export { handleNewUser, handleLogin };
