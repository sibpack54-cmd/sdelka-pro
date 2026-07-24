import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  name: z.string().optional(),
  businessName: z.string().optional(),
  phone: z.string().optional(),
  slug: z.string().optional(),
  telegramChatId: z.string().optional(),
  telegramEnabled: z.boolean().optional(),
});

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const payload = await verifyToken(authHeader.slice(7));
  return payload?.userId as string | undefined;
}

const profileSelect = {
  id: true,
  email: true,
  name: true,
  businessName: true,
  phone: true,
  logoUrl: true,
  slug: true,
  pdfTemplate: true,
  emailNotifications: true,
  telegramChatId: true,
  telegramEnabled: true,
  createdAt: true,
} as const;

// GET /api/user/profile — получить профиль
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile get error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PUT /api/user/profile — обновить профиль
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const body = await request.json();
    const updateData = profileUpdateSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: profileSelect,
    });

    return NextResponse.json({ success: true, ...user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ошибка валидации', details: error.errors }, { status: 400 });
    }
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
