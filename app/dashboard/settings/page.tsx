'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface UserSettings {
  businessName: string;
  slug: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  description: string;
  address: string;
  website: string;
  telegramChatId: string;
  telegramEnabled: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<UserSettings>({
    businessName: '',
    slug: '',
    email: '',
    phone: '',
    logoUrl: null,
    description: '',
    address: '',
    website: '',
    telegramChatId: '',
    telegramEnabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [testingTelegram, setTestingTelegram] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadSettings();
  }, [router]);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings({
          businessName: data.businessName || '',
          slug: data.slug || '',
          email: data.email || '',
          phone: data.phone || '',
          logoUrl: data.logoUrl || null,
          description: data.description || '',
          address: data.address || '',
          website: data.website || '',
          telegramChatId: data.telegramChatId || '',
          telegramEnabled: data.telegramEnabled || false,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setMessage('✅ Настройки сохранены');
      } else {
        setMessage('❌ Ошибка сохранения');
      }
    } catch (error) {
      setMessage('❌ Ошибка сети');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/logo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, logoUrl: data.logoUrl }));
        setMessage('✅ Логотип загружен');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Ошибка загрузки логотипа');
    }
  };

  const testTelegram = async () => {
    if (!settings.telegramChatId) return;
    setTestingTelegram(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId: settings.telegramChatId }),
      });
      if (response.ok) {
        setMessage('✅ Тестовое сообщение отправлено! Проверьте Telegram');
      } else {
        const data = await response.json();
        setMessage(`❌ ${data.error || 'Ошибка отправки'}`);
      }
    } catch (error) {
      setMessage('❌ Ошибка сети');
    } finally {
      setTestingTelegram(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-900">Настройки профиля</h1>

      {message && (
        <Card className={message.includes('✅') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="p-4 text-sm font-medium">{message}</div>
        </Card>
      )}

      {/* Логотип */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Логотип компании</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-dark-100 rounded-xl flex items-center justify-center overflow-hidden">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🏢</span>
              )}
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                📤 Загрузить логотип
              </Button>
              <p className="text-xs text-dark-400 mt-2">PNG, JPG до 2 МБ</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Основная информация */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Основная информация</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Название бизнеса *</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Иванов Фото"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">URL-адрес (slug) *</label>
              <div className="flex">
                <span className="px-3 py-2 bg-dark-100 border border-r-0 border-dark-200 rounded-l-lg text-dark-500 text-sm">
                  sdelka.pro/q/
                </span>
                <input
                  type="text"
                  value={settings.slug}
                  onChange={(e) => setSettings(prev => ({ ...prev, slug: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-dark-200 rounded-r-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="ivanov-photo"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Email *</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="demo@sdelka.pro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Телефон</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Telegram */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">💬 Telegram уведомления</h2>
          <p className="text-sm text-dark-500 mb-4">
            Получайте уведомления о новых заявках прямо в Telegram
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Chat ID</label>
              <input
                type="text"
                value={settings.telegramChatId}
                onChange={(e) => setSettings(prev => ({ ...prev, telegramChatId: e.target.value }))}
                placeholder="Например: 123456789"
                className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-dark-400 mt-1">
                Напишите боту и отправьте /start, чтобы получить ID
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.telegramEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, telegramEnabled: e.target.checked }))}
                  className="w-4 h-4 text-primary-500 border-dark-300 rounded"
                />
                <label className="text-sm text-dark-700">Включить уведомления</label>
              </div>
              <Button
                variant="outline"
                onClick={testTelegram}
                isLoading={testingTelegram}
                disabled={!settings.telegramChatId}
              >
                📨 Тест
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Дополнительно */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Дополнительно</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Описание бизнеса</label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Профессиональная фотосъёмка мероприятий..."
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Адрес</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="г. Москва, ул. Примерная, 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Сайт</label>
                <input
                  type="url"
                  value={settings.website}
                  onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Публичная ссылка */}
      <Card className="bg-primary-50 border-primary-100">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-2">Ваша публичная ссылка</h2>
          <p className="text-dark-500 mb-3">Поделитесь этой ссылкой с клиентами</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`https://sdelka.pro/q/${settings.slug}`}
              className="flex-1 px-4 py-2 bg-white border border-dark-200 rounded-lg text-dark-500"
            />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`https://sdelka.pro/q/${settings.slug}`);
                setMessage('✅ Ссылка скопирована');
                setTimeout(() => setMessage(''), 2000);
              }}
            >
              📋 Копировать
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={isSaving}>
          💾 Сохранить изменения
        </Button>
      </div>
    </div>
  );
}
