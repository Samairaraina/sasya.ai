import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/profile', requireAuth, UserController.getProfile);
router.put('/profile', requireAuth, UserController.updateProfile);

export default router;
