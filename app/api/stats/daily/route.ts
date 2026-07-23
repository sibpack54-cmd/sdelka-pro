import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        quiz: { userId: user.id },
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Группировка по дням
    const dailyData: Record<string, number> = {};
    submissions.forEach((sub) => {
      const date = sub.createdAt.toISOString().split('T')[0];
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    // Заполнение пропущенных дней
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      result.push({
        date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
        fullDate: dateStr,
        submissions: dailyData[dateStr] || 0,
      });
    }

    // Статистика
    const totalSubmissions = await prisma.submission.count({
      where: { quiz: { userId: user.id } },
    });

    const quizzes = await prisma.quiz.findMany({
      where: { userId: user.id },
      select: { views: true },
    });
    const totalViews = quizzes.reduce((sum, q) => sum + (q.views || 0), 0);

    return NextResponse.json({
      data: result,
      stats: {
        totalViews,
        totalSubmissions,
        conversionRate: totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 100) : 0,
      },
    });
  } catch (error: any) {
    console.error('Stats daily error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
