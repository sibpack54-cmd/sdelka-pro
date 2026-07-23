import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyToken } from '@/lib/auth';

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const payload = await verifyToken(authHeader.slice(7));
  return payload?.userId as string | undefined;
}

// GET /api/quizzes — список квизов пользователя
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const quizzes = await prisma.quiz.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Quizzes GET error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST /api/quizzes — создать квиз
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, questions, pricingFormula, welcomeMessage, thankYouMessage } = body;

    const quiz = await prisma.quiz.create({
      data: {
        userId,
        title: title || 'Новый квиз',
        description,
        questions: questions || [],
        pricingFormula,
        welcomeMessage: welcomeMessage || 'Ответьте на несколько вопросов',
        thankYouMessage: thankYouMessage || 'Спасибо! КП отправлено на почту',
      },
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error('Quizzes POST error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
