import { Router } from 'express';
import { authControllers } from '../controllers';
import { createNewUserValidationRules, requestValidator } from '../middleware';

const router = Router();

router.route('/register').post(requestValidator(createNewUserValidationRules), authControllers.handleNewUser);

router.route('/login').post(authControllers.handleLogin);

export default router;
