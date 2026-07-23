🚀 СДЕЛКА.ПРО
Квизы, которые продают
https://nextjs.org/
https://www.typescriptlang.org/
https://www.prisma.io/
https://tailwindcss.com/
https://www.postgresql.org/
</div>
✨ Что это?
СДЕЛКА.ПРО — платформа для создания интерактивных квизов, которые автоматически генерируют коммерческие предложения в PDF и отправляют их клиентам на email.
Идеально для: фотографов, event-менеджеров, ремонтных бригад, флористов, event-агентств и любого бизнеса, где нужен расчёт стоимости услуг.
🎯 Возможности
Таблица
Фича	Описание
📝 Конструктор квизов	Drag-and-drop вопросы, варианты ответов, формулы цен
📄 3 шаблона PDF	Стандартный, Современный (градиенты), Классический (serif)
📧 Email рассылка	Автоматическая отправка PDF через Resend
💬 Telegram уведомления	Мгновенные алерты о новых заявках
📊 Аналитика	Графики заявок, конверсия, средний чек
🎨 Кастомизация	Логотип, брендинг, публичная ссылка
📱 Адаптивный дизайн	Работает на телефоне, планшете, десктопе
🖼️ Скриншоты
<div align="center">
Таблица
Лендинг	Дашборд	Конструктор
🏠 Главная	📊 Статистика	📝 Создание квиза
Примеры квизов	Графики заявок	Вопросы и ответы
Тарифы	Быстрый старт	Формулы цен
</div>
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
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sdelka_pro"

# Auth
JWT_SECRET="your-super-secret-key-min-32-chars"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxx"

# Telegram Bot (опционально)
TELEGRAM_BOT_TOKEN="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"

# App
NEXTAUTH_URL="http://localhost:3000"
4. База данных
bash
npx prisma migrate dev --name init
npx prisma db seed
5. Запуск
bash
npm run dev
Открой http://localhost:3000
📁 Структура проекта
plain
sdelka-pro/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Вход/регистрация
│   │   ├── pdf/          # Генерация PDF
│   │   ├── q/            # Публичные квизы
│   │   ├── quizzes/      # CRUD квизов
│   │   ├── stats/        # Аналитика
│   │   ├── telegram/     # Уведомления
│   │   └── user/         # Профиль
│   ├── dashboard/        # Личный кабинет
│   ├── login/            # Страница входа
│   ├── register/         # Регистрация
│   └── page.tsx          # Лендинг
├── components/           # React компоненты
│   ├── QuizBuilder/     # Конструктор
│   ├── QuizRenderer/    # Прохождение
│   └── ui/              # UI-kit
├── lib/                  # Утилиты
│   ├── auth.ts          # JWT
│   ├── db/prisma.ts     # Prisma клиент
│   ├── email/           # Email сервис
│   ├── pdf/             # PDF генератор
│   └── price-calculator.ts
├── prisma/
│   ├── schema.prisma    # Модели БД
│   └── seed.ts          # Демо-данные
└── public/              # Статика
🛠️ Технологии
Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
Backend: Next.js API Routes, Prisma ORM
Database: PostgreSQL
PDF: Puppeteer + HTML шаблоны
Email: Resend API
Auth: JWT (jsonwebtoken)
Charts: Recharts
📝 Демо-аккаунт
Таблица
Поле	Значение
Email	demo@sdelka.pro
Пароль	demo123
🗺️ Roadmap
[x] MVP с квизами и PDF
[x] 3 шаблона PDF
[x] Telegram уведомления
[x] Графики и аналитика
[ ] Интеграция с CRM (Bitrix, AmoCRM)
[ ] Подключение ЮKassa/Stripe
[ ] Кастомные домены
[ ] White-label решение
[ ] Мобильное приложение
🤝 Контрибуция
Fork репозитория
Создай ветку: git checkout -b feature/amazing-feature
Commit: git commit -m "Add amazing feature"
Push: git push origin feature/amazing-feature
Открой Pull Request
📄 Лицензия
MIT License. Смотри LICENSE для деталей.
