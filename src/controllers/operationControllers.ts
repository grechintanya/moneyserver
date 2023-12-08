import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../middleware';
import { Operation, OperationInterface, UserRequest } from '../models';
import { removeOperationFromAccounts, writeOperationIntoAccounts } from '../helpers/operationHandlers';
import { Types } from 'mongoose';

export const getAllOperations = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const { count, categoryId, accountId, from, to } = req.query;
    let opNumber = count ? parseInt(count as string) : 0;
    let fromDate, toDate: Date;
    let filterObj: Partial<OperationInterface> = { userId: userId };

    if (categoryId) filterObj = { ...filterObj, categoryId: new Types.ObjectId(categoryId as string) };
    if (accountId) filterObj = { ...filterObj, accountId: new Types.ObjectId(accountId as string) };
    if (from) {
        fromDate = new Date(from as string);
        toDate = to ? new Date(to as string) : new Date();
        filterObj = { ...filterObj, date: { $gte: fromDate, $lte: toDate } };
    }
    try {
        const operations = await Operation.find(filterObj).sort('-date').limit(opNumber);
        return res.json(operations);
    } catch (err) {
        next(err);
    }
};

export const handleCreateOperation = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user;
    const newOperation: OperationInterface = req.body;
    try {
        const result = await writeOperationIntoAccounts(userId, newOperation);
        if (result) {
            const savedOperation = await Operation.create({ ...newOperation, userId: userId });
            return res.status(201).json({ result: savedOperation });
        } else {
            throw new HttpException(500, "Operation wasn't saved")
        }
    } catch (err) {
        next(err);
    }
};

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
            await Operation.deleteOne({ userID: userId, _id: id });
            return res.json({ message: 'Operation deleted' });
        } else {
            throw new HttpException(500, "Operation wasn't deleted")
        }
    } catch (err) {
        next(err);
    }
};
