'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка входа');
      }

      // Сохраняем токен
      localStorage.setItem('token', data.token);
      console.log('Token saved:', data.token);

      // Редирект
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Неверный email или пароль');
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
          <h1 className="text-2xl font-bold text-dark-900 mb-2">Вход</h1>
          <p className="text-dark-500 mb-6">Войдите в свой аккаунт</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="demo@sdelka.pro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="demo123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              Войти
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-dark-500">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-primary-500 hover:text-primary-600 font-medium">
              Зарегистрироваться
            </Link>
          </div>

          <div className="mt-4 p-3 bg-dark-50 rounded-lg text-xs text-dark-500">
            <p className="font-medium mb-1">Демо-аккаунт:</p>
            <p>Email: demo@sdelka.pro</p>
            <p>Пароль: demo123</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
