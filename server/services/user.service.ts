import { prisma } from '../../lib/prisma';

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        language: true,
        location: true,
        profileImage: true,
        createdAt: true,
      }
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateProfile(userId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        language: true,
        location: true,
        profileImage: true,
      }
    });
    return user;
  }
}
