'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (form.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          businessName: form.businessName,
          phone: form.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }

      localStorage.setItem('token', data.token);
      console.log('Token saved:', data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">СП</span>
            </div>
            <span className="text-xl font-bold text-dark-900">СДЕЛКА.ПРО</span>
          </Link>
        </div>

        <Card padding="lg">
          <h1 className="text-2xl font-bold text-dark-900 mb-2">Регистрация</h1>
          <p className="text-dark-500 mb-6">Создайте аккаунт бесплатно</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Название бизнеса"
              placeholder="Иванов Фото"
              value={form.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Телефон"
              placeholder="+7 (900) 123-45-67"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="Минимум 6 символов"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              autoComplete="new-password"
              required
            />
            <Input
              label="Подтвердите пароль"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              autoComplete="new-password"
              required
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              Создать аккаунт
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-dark-500">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              Войти
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
