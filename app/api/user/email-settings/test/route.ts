import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyToken } from '@/lib/auth';
import { Resend } from 'resend';

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const payload = await verifyToken(authHeader.slice(7));
  return payload?.userId as string | undefined;
}

// POST /api/user/email-settings/test — отправить тестовое письмо
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        resendApiKey: true,
        resendFrom: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    if (!user.resendApiKey) {
      return NextResponse.json({ error: 'API ключ не настроен' }, { status: 400 });
    }

    const resend = new Resend(user.resendApiKey);

    await resend.emails.send({
      from: user.resendFrom || 'onboarding@resend.dev',
      to: user.email,
      subject: 'Тестовое письмо от СДЕЛКА.ПРО',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #FF6B35;">Тестовое письмо</h2>
          <p>Здравствуйте!</p>
          <p>Это тестовое письмо для проверки настроек email.</p>
          <p>Если вы получили это письмо, значит настройки Resend работают корректно.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            Отправлено через <a href="https://sdelka.pro" style="color: #FF6B35;">СДЕЛКА.ПРО</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Тестовое письмо отправлено' });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: 'Ошибка отправки тестового письма' }, { status: 500 });
  }
}
