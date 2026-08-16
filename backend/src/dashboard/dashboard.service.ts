import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: number) {
    // 1. Get total topics in the system
    const totalTopics = await this.prisma.topic.count();

    // 2. Get user's completed topics
    const completedProgresses = await this.prisma.progress.findMany({
      where: {
        userId,
        status: ProgressStatus.COMPLETED,
      },
      select: { topicId: true },
    });
    const completedTopicIds = new Set(completedProgresses.map((p) => p.topicId));
    const completedTopicsCount = completedTopicIds.size;

    // 3. Calculate overall percentage
    const overallPercentage = totalTopics === 0 ? 0 : Number(((completedTopicsCount / totalTopics) * 100).toFixed(2));

    // 4. Get categories with their topics to calculate category-level stats
    const categories = await this.prisma.category.findMany({
      include: {
        topics: {
          select: { id: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    const categoriesStats = categories.map((cat) => {
      const catTotalTopics = cat.topics.length;
      let catCompletedTopics = 0;
      for (const topic of cat.topics) {
        if (completedTopicIds.has(topic.id)) {
          catCompletedTopics++;
        }
      }
      
      const catPercentage = catTotalTopics === 0 ? 0 : Number(((catCompletedTopics / catTotalTopics) * 100).toFixed(2));

      return {
        id: cat.id,
        name: cat.name,
        totalTopics: catTotalTopics,
        completedTopics: catCompletedTopics,
        percentage: catPercentage,
      };
    });

    return {
      overall: {
        totalTopics,
        completedTopics: completedTopicsCount,
        percentage: overallPercentage,
      },
      categories: categoriesStats,
    };
  }
}
