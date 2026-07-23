import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyToken } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const payload = await verifyToken(authHeader.slice(7));
  return payload?.userId as string | undefined;
}

// POST /api/user/logo — загрузка логотипа
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не загружен' }, { status: 400 });
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Только изображения' }, { status: 400 });
    }

    // Проверка размера (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Максимум 5MB' }, { status: 400 });
    }

    // Создаём директорию если нет
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Генерируем уникальное имя
    const ext = path.extname(file.name);
    const fileName = `${userId}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    // Сохраняем файл
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Обновляем пользователя
    const logoUrl = `/uploads/logos/${fileName}`;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { logoUrl },
      select: {
        id: true,
        email: true,
        logoUrl: true,
      },
    });

    return NextResponse.json({ success: true, user, logoUrl });
  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}
