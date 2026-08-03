import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import diseaseRoutes from './disease';
import infoRoutes from './info';
import adminRoutes from './admin';
import interactionRoutes from './interaction';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/disease', diseaseRoutes);
router.use('/info', infoRoutes);
router.use('/admin', adminRoutes);
router.use('/interaction', interactionRoutes);

// Remap legacy paths for smooth transition (optional)
router.use('/weather', infoRoutes);
router.use('/market-prices', infoRoutes);
router.use('/schemes', infoRoutes);
router.use('/feedback', interactionRoutes);
router.use('/notifications', interactionRoutes);

export default router;
