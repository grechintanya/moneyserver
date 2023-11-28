import { Router } from 'express';
import { authControllers } from '../controllers';

const router = Router();

router.route('/register').post(authControllers.handleNewUser);

router.route('/login').post(authControllers.handleLogin);

export default router;
