import { Schema, model, Types, Date } from 'mongoose';
import { Currency } from './account';

export type OperationType = 'income' | 'expense' | 'transfer';

export interface OperationInterface {
    _id?: Types.ObjectId;
    userId?: Types.ObjectId | string;
    date: Date | any;
    type: OperationType;
    currency: Currency;
    amount: number;
    accountId: Types.ObjectId | string;
    categoryId?: Types.ObjectId | string;
    comment?: string;
    recipientAccountId: Types.ObjectId | string;
};

const operationSchema = new Schema<OperationInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Schema.Types.Date,
        default: Date.now
    },
    type: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        default: 'грн.'
    },
    amount: {
        type: Number,
        required: true
    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    comment: {
        type: String
    },
    recipientAccountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
    },
});

export default model('Operation', operationSchema);
