import { Schema, model, Types } from 'mongoose';
import {CategoryInterface} from './interfaces';


const categorySchema = new Schema<CategoryInterface>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export default model('Category', categorySchema);
