import { Router } from 'express';
import { operationControllers } from '../controllers';
import { createOperationValidationRules, idValidationRules, moveOperationsValidationRules, requestValidator, updateOperationValidationRules } from '../middleware';

const router = Router();

router.route('/')
    .get(operationControllers.getAllOperations)
    .post(requestValidator(createOperationValidationRules), operationControllers.handleCreateOperation);

router.route('/category/:id')
    .get(requestValidator(idValidationRules), operationControllers.getOperationsNumberByCategory)
    .patch(requestValidator(moveOperationsValidationRules), operationControllers.handleReplaceOperationsByCategory);

router.route('/:id')
    .delete(requestValidator(idValidationRules), operationControllers.handleDeleteOperation)
    .patch(requestValidator(updateOperationValidationRules), operationControllers.handleUpdateOperation)

export default router;
