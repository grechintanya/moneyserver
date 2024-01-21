import { body, param, ValidationChain } from 'express-validator';

export const loginValidationRules: ValidationChain[] = [
    body('email').trim().notEmpty().withMessage('Email is required'),
    body('password').trim().notEmpty().withMessage('Password is required')
]

export const createNewUserValidationRules: ValidationChain[] = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    ...loginValidationRules
]

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

export const createAccountValidationRules: ValidationChain[] = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('name').trim().isLength({ min: 3, max: 20 }).withMessage("Name's length must be from 3 to 20 chars"),
    body('currency').optional().isIn(['грн.']).withMessage('Invalid currency'),
    body('mandatory').optional().isBoolean().withMessage('Mandatory must be false or true'),
    body('balance').isNumeric().withMessage('Balance should be a number')
];

export const updateAccountValidationRules: ValidationChain[] = [
    ...createAccountValidationRules, ...idValidationRules
];

export const createOperationValidationRules: ValidationChain[] = [
    body('type').isIn(['income', 'expense', 'transfer']).withMessage('Invalid operation type'),
    body('date').optional().isISO8601().withMessage('Invalid date'),
    body('currency').optional().isIn(['грн.']).withMessage('Invalid currency'),
    body('amount').notEmpty().withMessage('Amount is required'),
    body('amount').isNumeric().withMessage('Amount should be a number'),
    body('account').notEmpty().withMessage('Account is required'),
    body('account').trim().isHexadecimal().isLength({ min: 24, max: 24 }).withMessage('Invalid account'),
    body('category').optional().trim().isHexadecimal().isLength({ min: 24, max: 24 }).withMessage('Invalid category'),
    body('comment').optional().isLength({ max: 100 }).withMessage("Comment can't be more than 100 chars"),
    body('recipientAccount').optional().trim().isHexadecimal().isLength({ min: 24, max: 24 }).withMessage('Invalid recipient account'),
];

