import type { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await DashboardService.getAdminStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
