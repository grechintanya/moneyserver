import { Request } from 'express';
import { Types } from 'mongoose';

export interface UserRequest extends Request {
  user: string;
}

export type CategoryType = 'income' | 'expense';

export interface CategoryInterface {
  _id?: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  type: CategoryType;
}

export interface UserInterface {
  _id?: Types.ObjectId;
  username?: string,
  email: string,
  password: string
}