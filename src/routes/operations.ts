import { Router } from 'express';
import { operationControllers } from '../controllers';
import { createOperationValidationRules, idValidationRules, requestValidator } from '../middleware';

const router = Router();

router.route('/')
    .get(operationControllers.getAllOperations)
    .post(requestValidator(createOperationValidationRules), operationControllers.handleCreateOperation);

router.route('/:id')
    .delete(requestValidator(idValidationRules), operationControllers.handleDeleteOperation);

export default router;
