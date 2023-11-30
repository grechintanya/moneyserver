import { body, param, ValidationChain } from 'express-validator';

export const idValidationRules: ValidationChain[] = [
    param('id').trim().isHexadecimal().isLength({ min: 24, max: 24 }).withMessage('Invalid ID')
];

export const createCategoryValidationRules: ValidationChain[] = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('name').trim().isLength({ min: 3, max: 20 }).withMessage("Name's length must be from 3 to 20 chars"),
    body('type').trim().notEmpty().withMessage('Type is required'),
    body('type').trim().isIn(['expense', 'income']).withMessage('Invalid type')
];

export const updateCategoryValidationRules: ValidationChain[] = [
    ...createCategoryValidationRules, ...idValidationRules
];

