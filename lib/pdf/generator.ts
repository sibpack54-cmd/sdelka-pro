import puppeteer from 'puppeteer-core';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

export type TemplateId = 'default' | 'modern' | 'classic';

export interface PDFData {
  businessName: string;
  logoUrl?: string;
  phone?: string;
  clientName?: string;
  clientEmail: string;
  answers: Record<string, any>;
  price: number;
  date: string;
  templateId?: TemplateId;
}

export async function generatePDF(data: PDFData): Promise<Buffer> {
  const templateId = data.templateId || 'default';
  
  // Выбираем шаблон по templateId
  let templateHtml: string;
  switch (templateId) {
    case 'modern':
      templateHtml = getModernTemplate();
      break;
    case 'classic':
      templateHtml = getClassicTemplate();
      break;
    default:
      templateHtml = getDefaultTemplate();
  }

  // Компилируем Handlebars
  const template = Handlebars.compile(templateHtml);

  // Форматируем дату
  const formattedDate = new Date(data.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Форматируем ответы для отображения
  const formattedAnswers: Record<string, string> = {};
  for (const [key, value] of Object.entries(data.answers)) {
    if (Array.isArray(value)) {
      formattedAnswers[key] = value.join(', ');
    } else {
      formattedAnswers[key] = String(value);
    }
  }

  const html = template({
    ...data,
    date: formattedDate,
    priceFormatted: new Intl.NumberFormat('ru-RU').format(data.price),
    answers: formattedAnswers,
  });

  // Генерируем PDF через Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.CHROME_EXECUTABLE_PATH || undefined,
  }).catch((err) => {
    console.error('Puppeteer launch error:', err);
    throw new Error('Не удалось запустить браузер для генерации PDF. Убедитесь, что Chrome/Chromium установлен.');
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
  });

  await browser.close();

  return Buffer.from(pdf);
}

function getDefaultTemplate(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #FF6B35; }
    .header-left { flex: 1; }
    .title { font-size: 28px; font-weight: bold; color: #1a1a1a; margin-bottom: 5px; }
    .subtitle { font-size: 16px; color: #666; }
    .logo { max-width: 120px; max-height: 80px; object-fit: contain; }
    .info-section { margin: 25px 0; }
    .section-title { font-size: 14px; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 10px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #666; font-weight: 500; }
    .info-value { color: #1a1a1a; font-weight: 600; }
    .total-box { margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #fff5f0 0%, #ffe6d9 100%); border-radius: 12px; border-left: 4px solid #FF6B35; }
    .total-label { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
    .total-amount { font-size: 36px; font-weight: bold; color: #FF6B35; margin-top: 5px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
    .footer-contact { margin-top: 10px; }
    .footer-contact strong { color: #666; }
    .badge { display: inline-block; padding: 4px 12px; background: #f0f0f0; border-radius: 20px; font-size: 12px; color: #666; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="title">Коммерческое предложение</div>
      <div class="subtitle">{{businessName}}</div>
    </div>
    {{#if logoUrl}}<img src="{{logoUrl}}" class="logo" />{{/if}}
  </div>

  <div class="info-section">
    <div class="section-title">Информация о клиенте</div>
    <div class="info-row">
      <span class="info-label">Клиент</span>
      <span class="info-value">{{clientName}}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Email</span>
      <span class="info-value">{{clientEmail}}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Дата формирования</span>
      <span class="info-value">{{date}}</span>
    </div>
  </div>

  <div class="info-section">
    <div class="section-title">Детали заказа</div>
    {{#each answers}}
    <div class="info-row">
      <span class="info-label">{{@key}}</span>
      <span class="info-value">{{this}}</span>
    </div>
    {{/each}}
  </div>

  <div class="total-box">
    <div class="total-label">Итоговая стоимость</div>
    <div class="total-amount">{{priceFormatted}} ₽</div>
  </div>

  <div class="footer">
    <div><strong>{{businessName}}</strong></div>
    {{#if phone}}<div class="footer-contact">Телефон: {{phone}}</div>{{/if}}
    <div class="footer-contact">Документ сформирован через <strong>СДЕЛКА.ПРО</strong></div>
    <span class="badge">Действительно 14 дней</span>
  </div>
</body>
</html>`;
}

function getModernTemplate(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #1a1a2e; line-height: 1.6; background: #f8f9fa; }
    .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; color: white; }
    .title { font-size: 32px; font-weight: 700; margin-bottom: 10px; letter-spacing: -0.5px; }
    .subtitle { font-size: 18px; opacity: 0.9; font-weight: 300; }
    .logo { position: absolute; top: 40px; right: 40px; max-width: 100px; max-height: 60px; object-fit: contain; background: white; padding: 10px; border-radius: 12px; }
    .content { padding: 40px; }
    .info-section { margin: 30px 0; }
    .section-title { font-size: 12px; text-transform: uppercase; color: #667eea; letter-spacing: 2px; font-weight: 700; margin-bottom: 15px; }
    .info-card { background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%); padding: 20px; border-radius: 12px; margin-bottom: 12px; }
    .info-row { display: flex; justify-content: space-between; align-items: center; }
    .info-label { color: #6c757d; font-weight: 500; font-size: 14px; }
    .info-value { color: #1a1a2e; font-weight: 600; font-size: 15px; }
    .total-box { margin-top: 30px; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; color: white; text-align: center; }
    .total-label { font-size: 14px; opacity: 0.9; text-transform: uppercase; letter-spacing: 2px; font-weight: 500; }
    .total-amount { font-size: 48px; font-weight: 700; margin-top: 10px; }
    .footer { margin-top: 30px; padding: 20px; text-align: center; color: #6c757d; font-size: 13px; border-top: 1px solid #e9ecef; }
    .badge { display: inline-block; padding: 6px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 25px; font-size: 12px; color: white; font-weight: 600; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">Коммерческое предложение</div>
      <div class="subtitle">{{businessName}}</div>
    </div>
    {{#if logoUrl}}<img src="{{logoUrl}}" class="logo" />{{/if}}

    <div class="content">
      <div class="info-section">
        <div class="section-title">Информация о клиенте</div>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Клиент</span>
            <span class="info-value">{{clientName}}</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{clientEmail}}</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Дата</span>
            <span class="info-value">{{date}}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="section-title">Детали заказа</div>
        {{#each answers}}
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">{{@key}}</span>
            <span class="info-value">{{this}}</span>
          </div>
        </div>
        {{/each}}
      </div>

      <div class="total-box">
        <div class="total-label">Итоговая стоимость</div>
        <div class="total-amount">{{priceFormatted}} ₽</div>
      </div>
    </div>

    <div class="footer">
      <div><strong>{{businessName}}</strong></div>
      {{#if phone}}<div>Телефон: {{phone}}</div>{{/if}}
      <div>Документ сформирован через <strong>СДЕЛКА.ПРО</strong></div>
      <span class="badge">Действительно 14 дней</span>
    </div>
  </div>
</body>
</html>`;
}

function getClassicTemplate(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', 'Times New Roman', serif; padding: 50px; color: #2c2c2c; line-height: 1.8; background: #fff; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #2c2c2c; }
    .title { font-size: 36px; font-weight: normal; color: #2c2c2c; margin-bottom: 15px; letter-spacing: 1px; }
    .subtitle { font-size: 18px; color: #666; font-style: italic; }
    .logo { max-width: 150px; max-height: 100px; object-fit: contain; margin: 20px auto; display: block; }
    .info-section { margin: 35px 0; }
    .section-title { font-size: 16px; text-transform: uppercase; color: #2c2c2c; letter-spacing: 3px; margin-bottom: 20px; font-weight: normal; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; }
    .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #666; font-style: italic; }
    .info-value { color: #2c2c2c; font-weight: normal; }
    .total-box { margin-top: 40px; padding: 30px; background: #f8f8f8; border: 2px solid #2c2c2c; text-align: center; }
    .total-label { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 3px; font-style: italic; }
    .total-amount { font-size: 42px; font-weight: normal; color: #2c2c2c; margin-top: 15px; font-family: 'Georgia', serif; }
    .footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid #e0e0e0; color: #666; font-size: 13px; text-align: center; font-style: italic; }
    .footer-contact { margin-top: 10px; }
    .footer-contact strong { color: #2c2c2c; font-style: normal; }
    .badge { display: inline-block; padding: 8px 20px; border: 1px solid #2c2c2c; font-size: 12px; color: #2c2c2c; margin-top: 15px; text-transform: uppercase; letter-spacing: 2px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Коммерческое предложение</div>
    <div class="subtitle">{{businessName}}</div>
  </div>
  {{#if logoUrl}}<img src="{{logoUrl}}" class="logo" />{{/if}}

  <div class="info-section">
    <div class="section-title">Информация о клиенте</div>
    <div class="info-row">
      <span class="info-label">Клиент</span>
      <span class="info-value">{{clientName}}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Email</span>
      <span class="info-value">{{clientEmail}}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Дата формирования</span>
      <span class="info-value">{{date}}</span>
    </div>
  </div>

  <div class="info-section">
    <div class="section-title">Детали заказа</div>
    {{#each answers}}
    <div class="info-row">
      <span class="info-label">{{@key}}</span>
      <span class="info-value">{{this}}</span>
    </div>
    {{/each}}
  </div>

  <div class="total-box">
    <div class="total-label">Итоговая стоимость</div>
    <div class="total-amount">{{priceFormatted}} ₽</div>
  </div>

  <div class="footer">
    <div><strong>{{businessName}}</strong></div>
    {{#if phone}}<div class="footer-contact">Телефон: {{phone}}</div>{{/if}}
    <div class="footer-contact">Документ сформирован через <strong>СДЕЛКА.ПРО</strong></div>
    <span class="badge">Действительно 14 дней</span>
  </div>
</body>
</html>`;
}
