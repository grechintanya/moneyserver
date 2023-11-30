import { Schema, model } from 'mongoose';
import { UserInterface } from './interfaces';

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
