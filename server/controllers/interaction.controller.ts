import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';

export class NotificationController {
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' }
      });
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await prisma.notification.updateMany({
        where: { id: req.params.id, userId: req.user!.id },
        data: { isRead: true }
      });
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }
}

export class FeedbackController {
  static async submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, message } = req.body;
      if (!rating || !message) {
        return res.status(400).json({ error: 'Rating and message are required' });
      }

      const feedback = await prisma.feedback.create({
        data: {
          userId: req.user!.id,
          rating: Number(rating),
          message
        }
      });
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }
}
