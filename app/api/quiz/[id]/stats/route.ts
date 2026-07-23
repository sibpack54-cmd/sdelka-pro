import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const quizId = params.id;

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, userId: payload.userId },
      include: {
        _count: { select: { submissions: true } },
        submissions: {
          orderBy: { createdAt: 'desc' },
          take: 100,
          select: {
            id: true,
            clientName: true,
            clientEmail: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Средняя сумма
    const avgPrice = quiz.submissions.length > 0
      ? quiz.submissions.reduce((sum, s) => sum + (s.totalPrice || 0), 0) / quiz.submissions.length
      : 0;

    // Заявки по дням (последние 30 дней)
    const dailyData: Record<string, number> = {};
    quiz.submissions.forEach((sub) => {
      const date = sub.createdAt.toISOString().split('T')[0];
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        views: quiz.views || 0,
        submissions: quiz._count.submissions,
        avgPrice: Math.round(avgPrice),
        conversionRate: quiz.views > 0 ? Math.round((quiz._count.submissions / quiz.views) * 100) : 0,
      },
      dailyData,
      recentSubmissions: quiz.submissions.slice(0, 10),
    });
  } catch (error: any) {
    console.error('Quiz stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
