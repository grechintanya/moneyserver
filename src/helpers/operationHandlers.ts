import { Account, AccountInterface, OperationInterface } from '../models';
import { HttpException } from '../middleware';
import { Document } from 'mongoose';

const handleIncomeOperation = async (account: Document<AccountInterface> & AccountInterface,
    operation: OperationInterface): Promise<boolean> => {
    const newBalance = account.balance as number + operation.amount;
    const result = await account.updateOne({ balance: newBalance });
    return result.modifiedCount === 1;
};

const handleExpenseOperation = async (account: Document<AccountInterface> & AccountInterface,
    operation: OperationInterface): Promise<boolean> => {
    if (account.balance as number < operation.amount) {
        throw new HttpException(400, "Not enough money for this operation")
    };
    const newBalance = account.balance as number - operation.amount;
    const result = await account.updateOne({ balance: newBalance });
    return result.modifiedCount === 1;
};

const handleTransferOperation = async (account: Document<AccountInterface> & AccountInterface,
    recipientAccount: Document<AccountInterface> & AccountInterface,
    operation: OperationInterface): Promise<boolean> => {
    if (account.balance as number < operation.amount) {
        throw new HttpException(400, "Not enough money for this operation")
    };
    const newBalance = account.balance as number - operation.amount;
    const recipientBalance = recipientAccount?.balance as number + operation.amount;
    const result1 = await recipientAccount.updateOne({ balance: recipientBalance });
    const result2 = await account.updateOne({ balance: newBalance });
    return (result1.modifiedCount + result2.modifiedCount) === 2;
};

export const writeOperationIntoAccounts = async (userId: string, newOperation: OperationInterface): Promise<boolean> => {
    const opType = newOperation.type;
    const account = await Account.findOne({ userId: userId, _id: newOperation.accountId });
    if (!account) {
        throw new HttpException(400, 'Invalid account')
    }
    if (opType === 'income') {
        return await handleIncomeOperation(account, newOperation);
    } else if (opType === 'expense') {
        return await handleExpenseOperation(account, newOperation);
    } else if (opType === 'transfer') {
        const recipientAccount = await Account.findOne({ userId: userId, _id: newOperation.recipientAccountId });
        if (!recipientAccount) {
            throw new HttpException(400, 'Add second account!')
        }
        return await handleTransferOperation(account, recipientAccount, newOperation);
    } else {
        throw new HttpException(400, 'Invalid operation type!');
    }
};

export const removeOperationFromAccounts = async (userId: string, newOperation: OperationInterface): Promise<boolean> => {
    const opType = newOperation.type;
    const account = await Account.findOne({ userId: userId, _id: newOperation.accountId });
    if (!account) {
        throw new HttpException(400, 'Invalid account')
    }
    if (opType === 'income') {
        return await handleExpenseOperation(account, newOperation);
    } else if (opType === 'expense') {
        return await handleIncomeOperation(account, newOperation);
    } else if (opType === 'transfer') {
        const recipientAccount = await Account.findOne({ userId: userId, _id: newOperation.recipientAccountId });
        if (!recipientAccount) {
            throw new HttpException(400, 'Add second account!')
        }
        return await handleTransferOperation(recipientAccount, account, newOperation);
    } else {
        throw new HttpException(400, 'Invalid operation type!');
    }
};
