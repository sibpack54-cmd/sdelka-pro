import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const templateSchema = z.object({
  template: z.enum(['default', 'modern', 'classic']),
});

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const payload = await verifyToken(authHeader.slice(7));
  return payload?.userId as string | undefined;
}

// PUT /api/user/template — обновить шаблон PDF
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const body = await request.json();
    const { template } = templateSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { pdfTemplate: template },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        pdfTemplate: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Некорректный шаблон', details: error.errors }, { status: 400 });
    }
    console.error('Template update error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
