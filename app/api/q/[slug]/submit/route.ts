import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { calculatePrice } from '@/lib/price-calculator';
import { generatePDF } from '@/lib/pdf/generator';
import { sendEmail } from '@/lib/email/resend';
import { z } from 'zod';

const submitSchema = z.object({
  answers: z.record(z.any()),
  clientEmail: z.string().email('Некорректный email'),
  clientName: z.string().optional(),
});

// POST /api/q/[slug]/submit — отправить ответы, получить PDF
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { answers, clientEmail, clientName } = submitSchema.parse(body);

    // 1. Найти квиз
    const quiz = await prisma.quiz.findFirst({
      where: {
        user: { slug },
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Квиз не найден или неактивен' },
        { status: 404 }
      );
    }

    // 2. Рассчитать цену
    const questions = Array.isArray(quiz.questions) ? quiz.questions : JSON.parse(quiz.questions as string);
    const price = calculatePrice(questions, answers, quiz.pricingFormula);

    // 3. Сохранить submission
    const submission = await prisma.submission.create({
      data: {
        quizId: quiz.id,
        answers,
        calculatedPrice: price,
        clientEmail,
        clientName: clientName || answers['q5'] || 'Клиент',
        status: 'completed',
      },
    });

    // 4. Сгенерировать PDF с использованием шаблона пользователя
    let pdfUrl: string | null = null;
    try {
      const pdfBuffer = await generatePDF({
        businessName: quiz.user.businessName || 'Бизнес',
        logoUrl: quiz.user.logoUrl || undefined,
        phone: quiz.user.phone || undefined,
        clientName: clientName || answers['q5'] || 'Клиент',
        clientEmail,
        answers,
        price,
        date: new Date().toISOString(),
        templateId: quiz.user.pdfTemplate as 'default' | 'modern' | 'classic' || 'default',
      });

      // Сохраняем PDF во временную папку (в проде — S3/Cloudflare R2)
      const fs = await import('fs/promises');
      const path = await import('path');
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileName = `kp-${submission.id}.pdf`;
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, pdfBuffer);

      pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/uploads/pdfs/${fileName}`;

      // 5. Отправить email
      await sendEmail({
        to: clientEmail,
        subject: `КП от ${quiz.user.businessName || 'СДЕЛКА.ПРО'}`,
        text: `Здравствуйте!\n\nВаше коммерческое предложение готово.\nИтоговая сумма: ${new Intl.NumberFormat('ru-RU').format(price)} ₽\n\nС уважением, ${quiz.user.businessName || 'СДЕЛКА.ПРО'}`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #FF6B35;">Ваше коммерческое предложение</h2>
          <p>Здравствуйте${clientName ? ', ' + clientName : ''}!</p>
          <p>Ваше КП от <strong>${quiz.user.businessName || 'СДЕЛКА.ПРО'}</strong> готово.</p>
          <div style="background: #fff5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">Итоговая сумма:</p>
            <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #FF6B35;">
              ${new Intl.NumberFormat('ru-RU').format(price)} ₽
            </p>
          </div>
          <p>PDF-версия документа прикреплена к письму.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            Документ сформирован через <a href="https://sdelka.pro" style="color: #FF6B35;">СДЕЛКА.ПРО</a>
          </p>
        </div>`,
        pdfBuffer,
        pdfFileName: `КП-${quiz.user.businessName || 'sdelka'}.pdf`,
      });

      // Обновить статус
      await prisma.submission.update({
        where: { id: submission.id },
        data: { pdfUrl, status: 'email_sent' },
      });

    } catch (pdfError) {
      console.error('PDF/Email error:', pdfError);
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: 'error' },
      });
    }

    return NextResponse.json({
      success: true,
      price,
      priceFormatted: new Intl.NumberFormat('ru-RU').format(price),
      pdfUrl,
      message: quiz.thankYouMessage,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
