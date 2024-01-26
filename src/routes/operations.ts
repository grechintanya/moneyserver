import { Router } from 'express';
import { operationControllers } from '../controllers';
import { createOperationValidationRules, idValidationRules, requestValidator } from '../middleware';

const router = Router();

router.route('/')
    .get(operationControllers.getAllOperations)
    .post(requestValidator(createOperationValidationRules), operationControllers.handleCreateOperation);

router.route('/:id')
    .delete(requestValidator(idValidationRules), operationControllers.handleDeleteOperation);

router.route('/:id')
    .patch(requestValidator(idValidationRules), operationControllers.handleUpdateOperation)

router.route('/number/:id')
    .get(requestValidator(idValidationRules), operationControllers.getOperationsNumberByCategory)

export default router;
