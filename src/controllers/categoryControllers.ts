import { Request, Response } from 'express';
import { Category, CategoryInterface, UserRequest } from '../models';

export const getAllCategory = async (req: Request, res: Response) => {
  const userId = (req as UserRequest).user;
  try {
    const categories = await Category.find({ userId: userId });
    return res.json(categories);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

export const handleCreateCategory = async (req: Request, res: Response) => {
  const userId = (req as UserRequest).user;
  const newCategory: CategoryInterface = req.body;
  try {
    const result = await Category.create({
      userID: userId,
      name: newCategory.name,
      type: newCategory.type,
    });
    return res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

export const handleUpdateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as UserRequest).user;
  const updatedCategory: CategoryInterface = req.body;
  try {
    const result = await Category.findOneAndUpdate({ userID: userId, _id: id }, updatedCategory);
    return res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

export const handleDeleteCategory = async (req: Request, res: Response) => {
  const userId = (req as UserRequest).user;
  const id = req.params.id;
  try {
    const result = await Category.findOneAndDelete({ userID: userId, _id: id });
    return res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
