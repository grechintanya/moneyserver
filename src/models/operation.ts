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
    account: Types.ObjectId | string;
    category?: Types.ObjectId | string;
    comment?: string;
    recipientAccount?: Types.ObjectId | string;
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
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    comment: {
        type: String
    },
    recipientAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
    },
});

export default model('Operation', operationSchema);
