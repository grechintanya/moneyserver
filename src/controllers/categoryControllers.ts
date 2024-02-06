import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../middleware';
import { Category, CategoryInterface, CategoryType, Operation, UserRequest } from '../models';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as UserRequest).user;
  try {
    const categories = await Category.find({ userId: userId }, '-__v');
    return res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const handleCreateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as UserRequest).user;
  const newCategory: CategoryInterface = req.body;
  try {
    const result = await Category.create({
      userId: userId,
      name: newCategory.name,
      type: newCategory.type,
    });
    return res.status(201).json(result.toObject({ versionKey: false }));
  } catch (err) {
    next(err);
  }
};

export const handleUpdateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const userId = (req as UserRequest).user;
  const { name } = req.body;
  try {
    const result = await Category.findOneAndUpdate({ userID: userId, _id: id }, { name }, { new: true });
    if (!result) {
      throw new HttpException(404, 'Category not found');
    }
    return res.json(result.toObject({ versionKey: false }));
  } catch (err) {
    next(err);
  }
};

export const handleDeleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as UserRequest).user;
  const id = req.params.id;
  try {
    const opNumber = await Operation.countDocuments({ userId: userId, category: id });
    if (opNumber) {
      throw new HttpException(400, `Category includes ${opNumber} operations. Move them to another category`);
    }
    const result = await Category.deleteOne({ userID: userId, _id: id });
    if (!result.deletedCount) {
      throw new HttpException(404, 'Category not found');
    }
    return res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
