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

const categoryValidationRules: ValidationChain[] = [
    body('name').optional().trim().isLength({ min: 3, max: 20 }).withMessage("Name's length must be from 3 to 20 chars"),
    body('type').optional().trim().isIn(['expense', 'income']).withMessage('Invalid type')
];

export const createCategoryValidationRules: ValidationChain[] = [
    ...categoryValidationRules,
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('type').trim().notEmpty().withMessage('Type is required'),
]

export const updateCategoryValidationRules: ValidationChain[] = [
    ...categoryValidationRules, ...idValidationRules
];

const accountValidationRules: ValidationChain[] = [
    body('name').trim().optional().isLength({ min: 3, max: 20 }).withMessage("Name's length must be from 3 to 20 chars"),
    body('currency').optional().isIn(['грн.']).withMessage('Invalid currency'),
    body('mandatory').optional().isBoolean().withMessage('Mandatory must be false or true'),
    body('balance').optional().isNumeric().withMessage('Balance should be a number')
]

export const createAccountValidationRules: ValidationChain[] = [
    ...accountValidationRules,
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('balance').notEmpty().withMessage('Name is required')
];

export const updateAccountValidationRules: ValidationChain[] = [
    ...accountValidationRules, ...idValidationRules
];

const operationValidationRules: ValidationChain[] = [
    body('type').optional().isIn(['income', 'expense', 'transfer']).withMessage('Invalid operation type'),
    body('date').optional().isISO8601().withMessage('Invalid date'),
    body('currency').optional().isIn(['грн.']).withMessage('Invalid currency'),
    body('amount').optional().isNumeric().withMessage('Amount should be a number'),
    body('account').optional().trim().isHexadecimal().isLength({ min: 24, max: 24 }).withMessage('Invalid account'),
    body('category').optional().trim().isHexadecimal().isLength({ min: 24, max: 24 }).withMessage('Invalid category'),
    body('comment').optional().isLength({ max: 100 }).withMessage("Comment can't be more than 100 chars"),
    body('recipientAccount').optional().trim().isHexadecimal().isLength({ min: 24, max: 24 }).withMessage('Invalid recipient account'),
]

export const createOperationValidationRules: ValidationChain[] = [
    body('amount').notEmpty().withMessage('Amount is required'),
    body('account').notEmpty().withMessage('Account is required'),
    ...operationValidationRules
];

export const updateOperationValidationRules: ValidationChain[] = [
    ...operationValidationRules, ...idValidationRules
];

export const moveOperationsValidationRules: ValidationChain[] = [
    ...idValidationRules,
    body('newCategory').trim().isHexadecimal().isLength({ min: 24, max: 24 }).withMessage('Invalid account'),
]

