import { Schema, model, Types } from 'mongoose';

const accountSchema = new Schema({
  userID: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'грн.',
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default model('Account', accountSchema);
