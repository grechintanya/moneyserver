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
        const operations = await Operation.find(filterObj)
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
            let savedOperation = await Operation.create({ ...newOperation, userId: userId, date: new Date(newOperation.date) });
            savedOperation = await Operation.findById(savedOperation._id).populate('account', 'name')
                .populate('category', 'name').populate('recipientAccount', 'name');
            return res.status(201).json({ result: savedOperation });
        } else {
            throw new HttpException(500, "Operation wasn't saved")
        }
    } catch (err) {
        next(err);
    }
};

//check for errors!
export const handleUpdateOperation = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const id = req.params.id;
    const { operation } = req.body;
    try {
        const result = await Operation.findByIdAndUpdate(id, operation);
        return res.json(result);

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
