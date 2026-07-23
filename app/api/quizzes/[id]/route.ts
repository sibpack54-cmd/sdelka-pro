import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyToken } from '@/lib/auth';

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const payload = await verifyToken(authHeader.slice(7));
  return payload?.userId as string | undefined;
}

// GET /api/quizzes/[id] — получить квиз
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const { id } = await params;
    const quiz = await prisma.quiz.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Quiz GET error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PUT /api/quizzes/[id] — обновить квиз
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, questions, pricingFormula, isActive, welcomeMessage, thankYouMessage } = body;

    const { id } = await params;
    const existing = await prisma.quiz.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 });
    }

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title,
        description,
        questions,
        pricingFormula,
        isActive,
        welcomeMessage,
        thankYouMessage,
      },
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error('Quiz PUT error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE /api/quizzes/[id] — удалить квиз
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.quiz.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Квиз не найден' }, { status: 404 });
    }

    await prisma.quiz.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quiz DELETE error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
