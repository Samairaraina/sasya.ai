import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/stats', requireAuth, requireRole(['ADMIN']), DashboardController.getStats);

export default router;
