import { prisma } from '../../lib/prisma';

export class SchemeService {
  static async getSchemes() {
    return prisma.governmentScheme.findMany();
  }
}
