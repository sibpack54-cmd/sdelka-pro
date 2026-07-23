import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, createToken } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  businessName: z.string().min(2, 'Название бизнеса обязательно'),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, businessName, phone } = registerSchema.parse(body);

    // Проверка уникальности email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Генерация slug
    let slug = generateSlug(businessName);
    const existingSlug = await prisma.user.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Хеширование пароля
    const passwordHash = await hashPassword(password);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        businessName,
        slug,
        phone,
      },
    });

    // Создание JWT
    const token = await createToken({
      userId: user.id,
      email: user.email,
      slug: user.slug,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        slug: user.slug,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
