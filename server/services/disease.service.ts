import { prisma } from '../../lib/prisma';
import { AIService } from './ai.service';

export class DiseaseService {
  static async predictDisease(userId: string, cropName: string, imageUrl: string) {
    // 1. Call the AI service to get the prediction
    const aiResult = await AIService.analyzeImage(imageUrl, cropName);

    // 2. Save the report to the database
    const report = await prisma.diseaseReport.create({
      data: {
        userId,
        cropName,
        diseaseName: aiResult.diseaseName,
        confidence: aiResult.confidence,
        image: imageUrl,
        recommendation: aiResult.recommendation,
        prediction: {
          create: {
            modelVersion: aiResult.modelVersion,
            confidence: aiResult.confidence,
            rawOutput: JSON.stringify(aiResult.raw),
          }
        }
      },
      include: {
        prediction: true
      }
    });

    return report;
  }

  static async getHistory(userId: string) {
    return prisma.diseaseReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { prediction: true }
    });
  }

  static async getReportById(id: string, userId: string) {
    const report = await prisma.diseaseReport.findFirst({
      where: { id, userId },
      include: { prediction: true }
    });
    if (!report) throw new Error('Report not found');
    return report;
  }
}
