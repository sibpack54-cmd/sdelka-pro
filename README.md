  🚀 СДЕЛКА.ПРО — Квизы, которые продают
<div align="center">
https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js
https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript
https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma
https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css
https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql

Платформа для создания интерактивных квизов, которые автоматически генерируют коммерческие предложения в PDF и отправляют их клиентам на email.

🚀 Демо · 📖 Документация · 💬 Telegram

</div>
✨ Что это?
СДЕЛКА.ПРО — это конструктор квизов с автоматической генерацией коммерческих предложений. Идеально для:

📸 Фотографов — расчет свадебных и коммерческих съемок

🎨 Event-менеджеров — стоимость мероприятий под ключ

🛠️ Ремонтных бригад — смета на отделку и строительство

🌸 Флористов — расчет букетов и оформления

🎪 Event-агентств — стоимость ивентов любой сложности

🏢 Любого бизнеса, где нужен быстрый расчет стоимости услуг

💡 Бонус: Каждый квиз — это не просто опросник, а готовый инструмент продаж. Вы получаете лида, клиент — готовое КП в PDF.

🎯 Возможности
Фича	Описание	Статус
📝 Конструктор квизов	Drag-and-drop вопросы, варианты ответов, формулы цен, логические цепочки	✅
📄 3 шаблона PDF	Стандартный, Современный (градиенты), Классический (serif) с кастомизацией	✅
📧 Email рассылка	Автоматическая отправка PDF через Resend (до 100 писем/день бесплатно)	✅
💬 Telegram уведомления	Мгновенные алерты о новых заявках с деталями клиента	✅
📊 Аналитика	Графики заявок, конверсия, средний чек, воронка продаж	✅
🎨 Кастомизация	Логотип, брендинг, публичная ссылка на квиз, выбор шаблона	✅
🔒 Безопасность	JWT аутентификация, защита API, HTTPS ready	✅
📱 Адаптивный дизайн	Работает на телефоне, планшете, десктопе	✅
⚡ Производительность	Оптимизированный Next.js App Router, кеширование, lazy loading	✅
🖼️ Скриншоты
<div align="center"> <table> <tr> <td align="center"><b>🏠 Главная</b><br><img src="public/screenshots/landing.png" alt="Landing" width="300"/></td> <td align="center"><b>📊 Дашборд</b><br><img src="public/screenshots/dashboard.png" alt="Dashboard" width="300"/></td> </tr> <tr> <td align="center"><b>📝 Конструктор</b><br><img src="public/screenshots/builder.png" alt="Builder" width="300"/></td> <td align="center"><b>📄 Пример PDF</b><br><img src="public/screenshots/pdf.png" alt="PDF" width="300"/></td> </tr> </table> </div>
🚀 Быстрый старт
1. Клонирование
bash
git clone https://github.com/sibpack54-cmd/sdelka-pro.git
cd sdelka-pro
2. Установка зависимостей
bash
npm install
3. Настройка окружения
Создай файл .env:

env
# База данных
DATABASE_URL="postgresql://user:password@localhost:5432/sdelka_pro"

# Аутентификация
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend) — бесплатно до 100 писем/день
RESEND_API_KEY="re_xxxxxxxxxxxxxxxx"

# Telegram Bot (опционально)
TELEGRAM_BOT_TOKEN="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"

# JWT
JWT_SECRET="your-jwt-secret-key-min-32-chars"

# Сайт
NEXT_PUBLIC_APP_URL="http://localhost:3000"
4. База данных
bash
# Запусти PostgreSQL (Docker)
docker run -d --name sdelka-db -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:16

# Примени миграции
npx prisma migrate dev --name init

# Заполни демо-данными
npx prisma db seed
5. Запуск
bash
npm run dev
Открой http://localhost:3000 🎉

6. Демо-аккаунт
Поле	Значение
Email	demo@sdelka.pro
Пароль	demo123
📁 Структура проекта
text
sdelka-pro/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/                # API Routes
│   │   ├── 📁 auth/           # Вход/регистрация (JWT)
│   │   ├── 📁 pdf/            # Генерация PDF
│   │   ├── 📁 q/              # Публичные квизы
│   │   ├── 📁 quizzes/        # CRUD квизов
│   │   ├── 📁 stats/          # Аналитика
│   │   ├── 📁 telegram/       # Telegram уведомления
│   │   └── 📁 user/           # Профиль пользователя
│   ├── 📁 dashboard/          # Личный кабинет
│   │   ├── 📁 templates/      # Шаблоны PDF
│   │   ├── 📁 settings/       # Настройки
│   │   └── 📁 quiz/           # Управление квизами
│   ├── 📁 login/              # Страница входа
│   ├── 📁 register/           # Регистрация
│   └── 📄 page.tsx            # Лендинг
├── 📁 components/             # React компоненты
│   ├── 📁 QuizBuilder/        # Конструктор квизов
│   ├── 📁 QuizRenderer/       # Прохождение квиза
│   ├── 📁 PDFTemplates/       # Шаблоны PDF
│   └── 📁 ui/                 # UI-kit (кнопки, карточки, модалки)
├── 📁 lib/                    # Утилиты
│   ├── 📄 auth.ts             # JWT аутентификация
│   ├── 📁 db/                 # Prisma клиент
│   ├── 📁 email/              # Email сервис (Resend)
│   ├── 📁 pdf/                # PDF генератор (Puppeteer)
│   └── 📄 price-calculator.ts # Калькулятор цен
├── 📁 prisma/                 # Prisma ORM
│   ├── 📄 schema.prisma       # Модели БД
│   └── 📄 seed.ts             # Демо-данные
├── 📁 public/                 # Статические файлы
│   ├── 📁 logos/              # Логотипы пользователей
│   └── 📁 uploads/            # Загруженные файлы
├── 📄 .env                    # Переменные окружения
├── 📄 package.json            # Зависимости
└── 📄 README.md               # Документация
🛠️ Технологии
Категория	Технологии
Frontend	Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
Backend	Next.js API Routes, Prisma ORM, JWT, bcrypt
Database	PostgreSQL 16, Prisma Studio
PDF	Puppeteer, HTML + CSS шаблоны
Email	Resend API (альтернатива SendGrid)
Auth	JWT (jsonwebtoken), bcryptjs
Charts	Recharts (графики и аналитика)
Forms	React Hook Form, Zod
State	Zustand, React Context
Testing	Jest, React Testing Library
📝 Демо-аккаунт
Поле	Значение
Email	demo@sdelka.pro
Пароль	demo123
⚠️ Демо-аккаунт ограничен: максимум 5 квизов, без возможности отправки email.

🗺️ Roadmap
✅ Сделано
☑ MVP с квизами и PDF
☑ 3 шаблона PDF (Стандартный, Современный, Классический)
☑ Telegram уведомления
☑ Графики и аналитика в дашборде
☑ Адаптивный дизайн
☑ Настройка Resend email
☑ Загрузка логотипа
☑ Анимации (Framer Motion)
🔨 В разработке
□ Интеграция с CRM (Bitrix24, AmoCRM)
□ Подключение платежей (ЮKassa, Stripe)
□ A/B тестирование квизов
□ Экспорт данных (CSV, Excel)
📌 В планах
□ Кастомные домены для квизов
□ White-label решение
□ Мобильное приложение (React Native)
□ ИИ-генерация вопросов
□ Интеграция с Google Analytics
□ Webhook для внешних сервисов
🤝 Контрибуция
Мы рады любым вкладам в развитие проекта!

Fork репозитория

Создай ветку: git checkout -b feature/amazing-feature

Commit: git commit -m "Add amazing feature"

Push: git push origin feature/amazing-feature

Открой Pull Request

Правила:
Используй TypeScript строгой типизации

Следуй код-стайлу (Prettier + ESLint)

Пиши тесты для критических функций

Обновляй документацию

❓ FAQ
<details> <summary><b>Сколько стоит использование?</b></summary> <br> Сейчас платформа находится в открытом бета-тестировании — <b>бесплатно</b>. В будущем планируется система тарифов: Старт (бесплатно), Про ($29/мес), Бизнес ($99/мес). </details><details> <summary><b>Можно ли использовать свой дизайн?</b></summary> <br> Да! Доступны 3 встроенных шаблона PDF, а также полная кастомизация цветов, шрифтов и логотипа в настройках профиля. </details><details> <summary><b>Какие форматы квизов поддерживаются?</b></summary> <br> Поддерживаются все популярные форматы: одиночный выбор, множественный выбор, текстовый ввод, числовой ввод, шкала, дата, файл. </details><details> <summary><b>Как интегрировать с Telegram?</b></summary> <br> 1. Создай бота через @BotFather<br> 2. Получи токен и добавь в `.env`<br> 3. В настройках профиля укажи Chat ID<br> 4. Готово — уведомления о новых заявках приходят в Telegram! </details>
📄 Лицензия
MIT License. Смотри файл LICENSE для деталей.

🌐 Контакты
<div align="center">
https://img.shields.io/badge/%F0%9F%8C%90-sdelka.pro-8B5CF6?style=for-the-badge
https://img.shields.io/badge/%F0%9F%92%AC-Telegram-0088CC?style=for-the-badge&logo=telegram
https://img.shields.io/badge/%F0%9F%93%A7-Email-EA4335?style=for-the-badge&logo=gmail

</div>
<div align="center">
Сделано с ❤️ в Омске

⭐ Если проект вам понравился, поставьте звезду на GitHub!

</div>
