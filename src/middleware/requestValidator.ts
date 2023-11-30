import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { HttpException } from './errorHandler';

const requestValidator = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            for (let validation of validations) {
                const result = await validation.run(req);
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new HttpException(400, 'Invalid input!', errors.array());
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default requestValidator;
