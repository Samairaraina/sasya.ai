import { prisma } from '../../lib/prisma';

export class MarketService {
  static async getPrices(state?: string, crop?: string) {
    const where: any = {};
    if (state) where.state = state;
    if (crop) where.crop = crop;

    return prisma.marketPrice.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });
  }
}
