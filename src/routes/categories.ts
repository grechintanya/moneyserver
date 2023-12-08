import { Router } from 'express';
import { categoryControllers } from '../controllers';
import {
  requestValidator,
  createCategoryValidationRules,
  updateCategoryValidationRules,
  idValidationRules
} from '../middleware';

const router = Router();

router
  .route('/')
  .get(categoryControllers.getAllCategories)
  .post(requestValidator(createCategoryValidationRules), categoryControllers.handleCreateCategory);

router
  .route('/:id')
  .patch(requestValidator(updateCategoryValidationRules), categoryControllers.handleUpdateCategory)
  .delete(requestValidator(idValidationRules), categoryControllers.handleDeleteCategory);

export default router;
