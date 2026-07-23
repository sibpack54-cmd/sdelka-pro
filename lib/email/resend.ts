import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
  pdfBuffer?: Buffer;
  pdfFileName?: string;
}

export async function sendEmail(data: EmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY не настроен. Email не отправлен.');
    console.log('Email для отправки:', data);
    return;
  }

  const attachments = data.pdfBuffer
    ? [
        {
          content: data.pdfBuffer.toString('base64'),
          filename: data.pdfFileName || 'kp.pdf',
        },
      ]
    : [];

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'СДЕЛКА.ПРО <noreply@sdelka.pro>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html || `<p>${data.text}</p>`,
      attachments,
    });
    console.log(`✅ Email отправлен: ${data.to}`);
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error);
    throw error;
  }
}
