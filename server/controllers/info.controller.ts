import type { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weather.service';
import { MarketService } from '../services/market.service';
import { SchemeService } from '../services/schemes.service';

export class InfoController {
  static async getWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const { location } = req.query;
      if (!location) return res.status(400).json({ error: 'Location query parameter is required' });
      const weather = await WeatherService.getWeather(location as string);
      res.json(weather);
    } catch (error) {
      next(error);
    }
  }

  static async getMarketPrices(req: Request, res: Response, next: NextFunction) {
    try {
      const { state, crop } = req.query;
      const prices = await MarketService.getPrices(state as string, crop as string);
      res.json(prices);
    } catch (error) {
      next(error);
    }
  }

  static async getSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const schemes = await SchemeService.getSchemes();
      res.json(schemes);
    } catch (error) {
      next(error);
    }
  }
}
