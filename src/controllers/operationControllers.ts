import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../middleware';
import { Operation, OperationInterface, UserRequest } from '../models';
import { removeOperationFromAccounts, writeOperationIntoAccounts } from '../helpers/operationHandlers';
import { Types } from 'mongoose';

export const getAllOperations = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const { count, category, account, from, to } = req.query;
    let opNumber = count ? parseInt(count as string) : 0;
    let fromDate, toDate: Date;
    let filterObj: Partial<OperationInterface> = { userId: userId };

    if (category) filterObj = { ...filterObj, category: new Types.ObjectId(category as string) };
    if (account) filterObj = { ...filterObj, account: new Types.ObjectId(account as string) };
    if (from) {
        fromDate = new Date(from as string);
        toDate = to ? new Date(to as string) : new Date();
        filterObj = { ...filterObj, date: { $gte: fromDate, $lte: toDate } };
    }
    try {
        const operations = await Operation.find(filterObj, '-__v')
            .populate('account', 'name').populate('category', 'name').populate('recipientAccount', 'name')
            .sort('-date').limit(opNumber);
        return res.json(operations);
    } catch (err) {
        next(err);
    }
};

export const getOperationsNumberByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const categoryId = req.params.id;
    try {
        const opNumber = await Operation.countDocuments({ userId: userId, category: categoryId });
        return res.json({ category: categoryId, number: opNumber });
    } catch (err) {
        next(err);
    }
}

export const handleCreateOperation = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const newOperation: OperationInterface = req.body;
    try {
        const result = await writeOperationIntoAccounts(userId, newOperation);
        if (result) {
            let savedOperation = await Operation.create({ ...newOperation, userId: userId });
            savedOperation = await Operation.findById(savedOperation._id, '-__v').populate('account', 'name')
                .populate('category', 'name').populate('recipientAccount', 'name');
            return res.status(201).json(savedOperation);
        } else {
            throw new HttpException(500, "Operation wasn't saved")
        }
    } catch (err) {
        next(err);
    }
};

export const handleUpdateOperation = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userId = (req as UserRequest).user;
    const operation: Partial<OperationInterface> = req.body;
    try {
        const result = await Operation.findOneAndUpdate({ userId: userId, _id: id }, operation, { returnDocument: 'after' });
        if (result) {
            return res.json(result.toObject({ versionKey: false }));
        }
        throw new HttpException(404, 'Operation not found')
    } catch (err) {
        next(err);
    }
}

export const handleReplaceOperationsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const categoryId = req.params.id;
    const { newCategory } = req.body;
    try {
        const result = await Operation.updateMany({ userId: userId, category: categoryId }, { category: newCategory });
        if (result.modifiedCount) {
            return res.json({ message: `${result.modifiedCount} operations moved to category ${newCategory}` });
        }
        throw new HttpException(404, 'Operations not found');
    } catch (err) {
        next(err);
    }
}

export const handleDeleteOperation = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const id = req.params.id;
    try {
        const operation = await Operation.findById(id);
        if (!operation) {
            throw new HttpException(404, 'Operation not found');
        }
        const result = await removeOperationFromAccounts(userId, operation);
        if (result) {
            await Operation.deleteOne({ userId: userId, _id: id });
            return res.json({ message: 'Operation deleted' });
        } else {
            throw new HttpException(500, "Operation wasn't deleted")
        }
    } catch (err) {
        next(err);
    }
};
