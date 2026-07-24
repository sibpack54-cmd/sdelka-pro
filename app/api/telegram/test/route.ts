import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json({ error: 'chatId required' }, { status: 400 });
    }

    const testMessage = `
🧪 <b>Тестовое уведомление СДЕЛКА.ПРО</b>

✅ Бот настроен корректно!
📅 Тест отправлен: ${new Date().toLocaleString('ru-RU')}

Теперь вы будете получать уведомления о новых заявках.
    `.trim();

    await sendTelegramMessage(chatId, testMessage);

    await prisma.user.update({
      where: { id: payload.userId as string },
      data: { telegramChatId: chatId, telegramEnabled: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Telegram test error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send test' }, { status: 500 });
  }
}
