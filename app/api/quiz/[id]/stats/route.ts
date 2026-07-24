import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id: quizId } = await params;

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, userId: payload.userId as string },
      include: {
        _count: { select: { submissions: true } },
        submissions: {
          orderBy: { createdAt: 'desc' },
          take: 100,
          select: {
            id: true,
            clientName: true,
            clientEmail: true,
            calculatedPrice: true,
            createdAt: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const avgPrice = quiz.submissions.length > 0
      ? quiz.submissions.reduce((sum, s) => sum + (s.calculatedPrice || 0), 0) / quiz.submissions.length
      : 0;

    const dailyData: Record<string, number> = {};
    quiz.submissions.forEach((sub) => {
      const date = sub.createdAt.toISOString().split('T')[0];
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        views: 0,
        submissions: quiz._count.submissions,
        avgPrice: Math.round(avgPrice),
        conversionRate: 0,
      },
      dailyData,
      recentSubmissions: quiz.submissions.slice(0, 10),
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Quiz stats error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
