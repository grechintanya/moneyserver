import { Request } from 'express';
import { Schema, model, Types } from 'mongoose';

export interface UserRequest extends Request {
  user: string;
};

export interface UserInterface {
  _id?: Types.ObjectId;
  username?: string,
  email: string,
  password: string
};

const userSchema = new Schema<UserInterface>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default model('User', userSchema);
