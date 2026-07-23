#!/bin/bash

set -e

echo "🚀 СДЕЛКА.ПРО — Запуск проекта"
echo "================================"

# Проверка .env
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Копирую из .env.example..."
    cp .env.example .env
    echo "✅ .env создан. Отредактируйте его перед запуском!"
    exit 1
fi

# Установка зависимостей
if [ ! -d node_modules ]; then
    echo "📦 Установка зависимостей..."
    npm install
fi

# Генерация Prisma Client
echo "🔄 Генерация Prisma Client..."
npx prisma generate

# Проверка миграций
echo "🔄 Проверка миграций..."
npx prisma migrate dev --name init || true

# Seed (если база пустая)
echo "🌱 Заполнение демо-данными..."
npx prisma db seed || true

# Запуск
echo "🚀 Запуск dev-сервера..."
npm run dev
