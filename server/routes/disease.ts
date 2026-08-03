import { Router } from 'express';
import { DiseaseController } from '../controllers/disease.controller';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/predict', requireAuth, upload.single('image'), DiseaseController.predict);
router.get('/history', requireAuth, DiseaseController.getHistory);
router.get('/:id', requireAuth, DiseaseController.getReport);

export default router;
