import { Schema, model, Types } from 'mongoose';

const categorySchema = new Schema({
  userID: {
    type: Types.ObjectId,
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
