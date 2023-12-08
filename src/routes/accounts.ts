import { Router } from 'express';
import { accountControllers } from '../controllers';
import { createAccountValidationRules, idValidationRules, requestValidator, updateAccountValidationRules } from '../middleware';

const router = Router();

router.route('/')
    .get(accountControllers.getAllAccounts)
    .post(requestValidator(createAccountValidationRules), accountControllers.handleCreateAccount);

router.route('/:id')
    .patch(requestValidator(updateAccountValidationRules), accountControllers.handleUpdateAccount)
    .delete(requestValidator(idValidationRules), accountControllers.handleDeleteAccount);

export default router;
