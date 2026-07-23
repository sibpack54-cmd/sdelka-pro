import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Системный шаблон PDF
  await prisma.pdfTemplate.create({
    data: {
      name: 'КП для фотографа',
      htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #FF6B35; padding-bottom: 20px; }
    .logo { max-width: 120px; max-height: 60px; }
    .title { font-size: 24px; font-weight: bold; color: #1a1a1a; }
    .subtitle { color: #666; margin-top: 5px; }
    .info-block { margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .total { font-size: 22px; font-weight: bold; color: #FF6B35; margin-top: 30px; padding: 15px; background: #fff5f0; border-radius: 8px; }
    .footer { margin-top: 40px; color: #666; font-size: 12px; }
    .contact { margin-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">Коммерческое предложение</div>
      <div class="subtitle">{{businessName}}</div>
    </div>
    {{#if logoUrl}}<img src="{{logoUrl}}" class="logo" />{{/if}}
  </div>

  <div class="info-block">
    <div class="info-row"><span>Клиент:</span><span>{{clientName}}</span></div>
    <div class="info-row"><span>Email:</span><span>{{clientEmail}}</span></div>
    <div class="info-row"><span>Дата:</span><span>{{date}}</span></div>
  </div>

  <div class="info-block">
    <h3>Детали заказа:</h3>
    {{#each answers}}
    <div class="info-row"><span>{{@key}}:</span><span>{{this}}</span></div>
    {{/each}}
  </div>

  <div class="total">Итого: {{price}} ₽</div>

  <div class="footer">
    <div class="contact">С уважением, {{businessName}}</div>
    <div class="contact">Тел: {{phone}}</div>
    <div class="contact">Документ сформирован через СДЕЛКА.ПРО</div>
  </div>
</body>
</html>`,
      isDefault: true,
    },
  });

  // Демо-пользователь
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@sdelka.pro',
      passwordHash: hashedPassword,
      businessName: 'Иванов Фото',
      slug: 'ivanov-photo',
      phone: '+7 (900) 123-45-67',
    },
  });

  // Демо-квиз для фотографа
  await prisma.quiz.create({
    data: {
      userId: demoUser.id,
      title: 'Расчёт стоимости фотосъёмки',
      description: 'Ответьте на несколько вопросов, и мы рассчитаем стоимость',
      isActive: true,
      questions: JSON.stringify([
        {
          id: 'q1',
          type: 'single_choice',
          question: 'Тип съёмки',
          required: true,
          options: [
            { label: 'Свадьба', value: 'wedding', pricePerHour: 5000 },
            { label: 'Портретная', value: 'portrait', pricePerHour: 3000 },
            { label: 'Репортаж', value: 'reportage', pricePerHour: 2500 },
            { label: 'Предметная', value: 'product', pricePerHour: 4000 },
          ],
        },
        {
          id: 'q2',
          type: 'number',
          question: 'Количество часов',
          required: true,
          min: 1,
          max: 12,
          default: 2,
        },
        {
          id: 'q3',
          type: 'multi_choice',
          question: 'Дополнительные услуги',
          options: [
            { label: 'Ретушь фото (20 шт)', value: 'retouch', priceAdd: 5000 },
            { label: 'Фотоальбом (30×30)', value: 'album', priceAdd: 8000 },
            { label: 'Видеосъёмка', value: 'video', priceAdd: 15000 },
            { label: 'Дополнительный фотограф', value: 'extra_photographer', priceAdd: 10000 },
          ],
        },
        {
          id: 'q4',
          type: 'single_choice',
          question: 'Срочность',
          options: [
            { label: 'Стандарт (2–3 недели)', value: 'normal', multiplier: 1 },
            { label: 'Срочно (3–5 дней) +30%', value: 'urgent', multiplier: 1.3 },
            { label: 'Экспресс (1–2 дня) +50%', value: 'express', multiplier: 1.5 },
          ],
        },
        {
          id: 'q5',
          type: 'text',
          question: 'Ваше имя',
          required: true,
        },
        {
          id: 'q6',
          type: 'text',
          question: 'Email для отправки КП',
          required: true,
          inputType: 'email',
        },
      ]),
      pricingFormula: null, // Используем стандартную логику
      welcomeMessage: 'Добро пожаловать! Рассчитаем стоимость вашей фотосъёмки за 2 минуты.',
      thankYouMessage: 'Спасибо! Коммерческое предложение отправлено на вашу почту.',
    },
  });

  console.log('✅ Seed завершён');
  console.log('Демо-пользователь: demo@sdelka.pro / demo123');
  console.log('Ссылка на квиз: http://localhost:3000/q/ivanov-photo');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
