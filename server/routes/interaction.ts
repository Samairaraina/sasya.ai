import { Router } from 'express';
import { NotificationController, FeedbackController } from '../controllers/interaction.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/notifications', requireAuth, NotificationController.getNotifications);
router.patch('/notifications/:id', requireAuth, NotificationController.markAsRead);

router.post('/feedback', requireAuth, FeedbackController.submitFeedback);

export default router;
