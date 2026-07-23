# СДЕЛКА.ПРО

Конструктор квизов и коммерческих предложений для малого бизнеса.

## Быстрый старт

```bash
# 1. Клонируй репозиторий
cd sdelka-pro

# 2. Запусти скрипт
./start.sh
```

Или вручную:

```bash
# Установка зависимостей
npm install

# Настройка .env
cp .env.example .env
# Отредактируй .env — укажи DATABASE_URL

# Миграция базы данных
npx prisma migrate dev --name init

# Заполнение демо-данными
npx prisma db seed

# Запуск dev-сервера
npm run dev
```

## Демо

После seed:
- Лендинг: http://localhost:3000
- Демо-квиз: http://localhost:3000/q/ivanov-photo
- Дашборд: http://localhost:3000/dashboard
- Демо-аккаунт: demo@sdelka.pro / demo123

## Структура проекта

```
sdelka-pro/
├── app/
│   ├── (public)/[slug]/       # Публичный квиз для клиентов
│   ├── (dashboard)/            # Личный кабинет бизнеса
│   │   ├── page.tsx            # Обзор / статистика
│   │   ├── quiz/               # Управление квизами
│   │   │   ├── page.tsx        # Список квизов
│   │   │   ├── new/            # Создание квиза
│   │   │   └── [id]/           # Редактирование + лиды
│   │   ├── templates/          # Шаблоны PDF
│   │   └── settings/           # Настройки профиля
│   ├── api/                    # API Routes
│   ├── login/                  # Страница входа
│   ├── register/               # Страница регистрации
│   ├── layout.tsx              # Корневой layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # UI-компоненты (Button, Input, Card)
│   ├── QuizBuilder/            # Конструктор квиза (drag-and-drop)
│   └── QuizRenderer/           # Рендер публичного квиза
├── lib/
│   ├── db/prisma.ts            # Prisma клиент
│   ├── auth.ts                 # JWT (jose)
│   ├── price-calculator.ts     # Калькулятор цен
│   ├── pdf/generator.ts        # Генерация PDF (Puppeteer + Handlebars)
│   ├── pdf/templates/          # HTML-шаблоны PDF
│   ├── email/resend.ts         # Отправка email
│   └── utils.ts                # Хелперы
├── prisma/
│   ├── schema.prisma           # Схема БД
│   └── seed.ts                 # Демо-данные
├── types/
│   └── index.ts                # TypeScript типы
└── middleware.ts               # Защита роутов
```

## API Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | /api/auth/register | Регистрация |
| POST | /api/auth/login | Авторизация |
| GET | /api/auth/me | Текущий пользователь |
| GET | /api/quizzes | Список квизов |
| POST | /api/quizzes | Создать квиз |
| GET | /api/quizzes/[id] | Получить квиз |
| PUT | /api/quizzes/[id] | Обновить квиз |
| DELETE | /api/quizzes/[id] | Удалить квиз |
| GET | /api/quizzes/[id]/submissions | Лиды |
| GET | /api/q/[slug] | Публичный квиз |
| POST | /api/q/[slug]/submit | Отправить ответы + PDF |
| POST | /api/pdf/generate | Генерация PDF |

## Флоу работы

### Для бизнеса:
1. Регистрация → личный кабинет
2. Создание квиза (вопросы + цены)
3. Активация квиза
4. Получение уникальной ссылки: `sdelka.pro/q/ivanov-photo`
5. Отслеживание лидов в дашборде

### Для клиента:
1. Переходит по ссылке
2. Отвечает на вопросы квиза
3. Видит предварительную сумму
4. Вводит email
5. Получает PDF на почту

## Монетизация (будущее)

| Тариф | Цена | Лимиты |
|-------|------|--------|
| Free | 0₽ | 1 квиз, 50 прохождений/мес |
| Pro | 990₽/мес | Безлимит квизов, 500 прохождений |
| Business | 2990₽/мес | Безлимит всего, API |

## Лицензия

MIT
