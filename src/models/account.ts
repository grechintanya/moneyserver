import { Schema, model, Types } from 'mongoose';

export type Currency = 'грн.'

export interface AccountInterface {
  _id?: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  mandatory?: boolean,
  currency?: Currency;
  balance?: number
};

const accountSchema = new Schema<AccountInterface>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mandatory: {
    type: Boolean,
    default: false
  },
  currency: {
    type: String,
    default: 'грн.',
  },
  balance: {
    type: Number,
    default: 0,
  },
});

export default model('Account', accountSchema);
