import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../middleware';
import { Account, AccountInterface, Operation, UserRequest } from '../models';

export const getAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    try {
        const accounts = await Account.find({ userId: userId });
        return res.json(accounts);
    } catch (err) {
        next(err);
    }
};

export const handleCreateAccount = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const newAccount: AccountInterface = req.body;
    try {
        const result = await Account.create({
            userId: userId,
            name: newAccount.name,
            currency: newAccount.currency,
            balance: newAccount.balance
        });
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const handleUpdateAccount = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userId = (req as UserRequest).user;
    const updatedAccount: AccountInterface = req.body;
    try {
        const result = await Account.findOneAndUpdate({ userID: userId, _id: id }, updatedAccount, { new: true });
        if (!result) {
            throw new HttpException(404, 'Account not found');
        }
        return res.json(result);
    } catch (err) {
        next(err);
    }
};

export const handleDeleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const accountId = req.params.id;
    const { anotherAccountId } = req.body;
    if (accountId === anotherAccountId) throw new HttpException(400, 'Choose another account');
    try {
        const account = await Account.findOne({ userID: userId, _id: accountId });
        const anotherAccount = await Account.findOne({ userID: userId, _id: anotherAccountId });
        if (!account || anotherAccount) {
            throw new HttpException(404, 'Account not found');
        }
        if (account?.mandatory) {
            throw new HttpException(400, "Account can't be deleted");
        }
        const result = await Operation.updateMany({ userID: userId, accountId: accountId },
            { accountId: anotherAccountId });
        console.log(result);
        await Account.deleteOne({ userID: userId, _id: accountId });
        return res.json({ message: 'Account deleted' });
    } catch (err) {
        next(err);
    }
};
