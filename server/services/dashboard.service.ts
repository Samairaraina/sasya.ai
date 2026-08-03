import { prisma } from '../../lib/prisma';

export class DashboardService {
  static async getAdminStats() {
    const totalUsers = await prisma.user.count();
    const totalReports = await prisma.diseaseReport.count();
    
    // Most common diseases
    const diseaseGroups = await prisma.diseaseReport.groupBy({
      by: ['diseaseName'],
      _count: { diseaseName: true },
      orderBy: { _count: { diseaseName: 'desc' } },
      take: 5
    });

    const averageFeedback = await prisma.feedback.aggregate({
      _avg: { rating: true },
      _count: true
    });

    return {
      totalUsers,
      totalReports,
      commonDiseases: diseaseGroups,
      feedback: averageFeedback
    };
  }
}
