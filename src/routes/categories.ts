import { Router } from 'express';
import { categoryControllers } from '../controllers';

const router = Router();

router
  .route('/')
  .get(categoryControllers.getAllCategory)
  .post(categoryControllers.handleCreateCategory);

router
  .route('/:id')
  .patch(categoryControllers.handleUpdateCategory)
  .delete(categoryControllers.handleDeleteCategory);

export default router;
