import { Router } from 'express';
import { InfoController } from '../controllers/info.controller';

const router = Router();

router.get('/weather', InfoController.getWeather);
router.get('/market-prices', InfoController.getMarketPrices);
router.get('/schemes', InfoController.getSchemes);

export default router;
