import type { Request, Response, NextFunction } from 'express';
import { DiseaseService } from '../services/disease.service';

export class DiseaseController {
  static async predict(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }
      
      const { cropName } = req.body;
      if (!cropName) {
        return res.status(400).json({ error: 'Crop name is required' });
      }

      // Convert local file path to accessible URL (assuming static file serving)
      // In production, this might be uploaded to Supabase Storage first.
      const imageUrl = `/uploads/${req.file.filename}`;

      const report = await DiseaseService.predictDisease(req.user!.id, cropName, imageUrl);
      res.status(201).json(report);
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await DiseaseService.getHistory(req.user!.id);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }

  static async getReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await DiseaseService.getReportById(req.params.id, req.user!.id);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }
}
