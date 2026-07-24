import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const { chatId, message } = await req.json();

    if (!chatId || !message) {
      return NextResponse.json({ error: 'chatId and message required' }, { status: 400 });
    }

    const messageId = await sendTelegramMessage(chatId, message);

    return NextResponse.json({ success: true, messageId });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Telegram notify error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send message' }, { status: 500 });
  }
}
