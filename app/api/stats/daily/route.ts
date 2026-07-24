import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
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

    const dailyData: Record<string, number> = {};
    submissions.forEach((sub) => {
      const date = sub.createdAt.toISOString().split('T')[0];
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

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

    const totalSubmissions = await prisma.submission.count({
      where: { quiz: { userId: user.id } },
    });

    return NextResponse.json({
      data: result,
      stats: {
        totalViews: 0,
        totalSubmissions,
        conversionRate: 0,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Stats daily error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
