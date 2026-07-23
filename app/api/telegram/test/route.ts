import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json({ error: 'chatId required' }, { status: 400 });
    }

    if (!BOT_TOKEN) {
      return NextResponse.json({ error: 'Telegram bot not configured' }, { status: 500 });
    }

    const testMessage = `
🧪 <b>Тестовое уведомление СДЕЛКА.ПРО</b>

✅ Бот настроен корректно!
📅 Тест отправлен: ${new Date().toLocaleString('ru-RU')}

Теперь вы будете получать уведомления о новых заявках.
    `.trim();

    const response = await fetch(`${BOT_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || 'Telegram API error');
    }

    // Сохраняем chatId в профиль
    await prisma.user.update({
      where: { id: payload.userId },
      data: { telegramChatId: chatId, telegramEnabled: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Telegram test error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send test' }, { status: 500 });
  }
}
