import { Schema, model, Types } from 'mongoose';

export type CategoryType = 'income' | 'expense';

export interface CategoryInterface {
  _id?: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  type: CategoryType;
};

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
