import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const emailSettingsSchema = z.object({
  resendApiKey: z.string().optional(),
  resendFrom: z.string().email().optional(),
});

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const payload = await verifyToken(authHeader.slice(7));
  return payload?.userId as string | undefined;
}

// GET /api/user/email-settings — получить настройки email
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        resendApiKey: true,
        resendFrom: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json({
      resendApiKey: user.resendApiKey ? '••••••••' : '',
      resendFrom: user.resendFrom || '',
      isConfigured: !!user.resendApiKey,
    });
  } catch (error) {
    console.error('Email settings get error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PUT /api/user/email-settings — обновить настройки email
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const body = await request.json();
    const { resendApiKey, resendFrom } = emailSettingsSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        resendApiKey: resendApiKey || null,
        resendFrom: resendFrom || null,
      },
      select: {
        id: true,
        email: true,
        resendApiKey: true,
        resendFrom: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ошибка валидации', details: error.errors }, { status: 400 });
    }
    console.error('Email settings update error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
