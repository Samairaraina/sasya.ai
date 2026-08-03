import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getProfile(req.user!.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateProfile(req.user!.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
