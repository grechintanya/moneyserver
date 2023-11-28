import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface UserRequest extends Request {
  user: string;
}

type CategoryType = 'Income' | 'Expense';

export interface CategoryInterface {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  type: CategoryType;
}
