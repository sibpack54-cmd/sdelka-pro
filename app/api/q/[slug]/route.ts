import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/q/[slug] — публичный квиз (без авторизации)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const quiz = await prisma.quiz.findFirst({
      where: {
        user: { slug },
        isActive: true,
      },
      include: {
        user: {
          select: {
            businessName: true,
            logoUrl: true,
            phone: true,
            slug: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Квиз не найден или неактивен' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      welcomeMessage: quiz.welcomeMessage,
      thankYouMessage: quiz.thankYouMessage,
      questions: quiz.questions,
      businessName: quiz.user.businessName,
      logoUrl: quiz.user.logoUrl,
      phone: quiz.user.phone,
      slug: quiz.user.slug,
    });
  } catch (error) {
    console.error('Public quiz GET error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
