'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface PdfTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  isDefault: boolean;
}

const templates: PdfTemplate[] = [
  {
    id: 'default',
    name: 'Стандартный',
    description: 'Чистый минималистичный дизайн с логотипом СДЕЛКА.ПРО',
    preview: '📄',
    isDefault: true,
  },
  {
    id: 'modern',
    name: 'Современный',
    description: 'Фиолетовые градиенты, тени, современный стиль',
    preview: '🎨',
    isDefault: false,
  },
  {
    id: 'classic',
    name: 'Классический',
    description: 'Serif шрифты, строгие рамки, бизнес-стиль',
    preview: '🏢',
    isDefault: false,
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [emailConfig, setEmailConfig] = useState({
    resendKey: '',
    fromEmail: '',
    isConfigured: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Загружаем профиль (там pdfTemplate)
      const profileRes = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const data = await profileRes.json();
        if (data.user?.pdfTemplate) {
          setSelectedTemplate(data.user.pdfTemplate);
        }
      }

      // Загружаем настройки email
      const emailRes = await fetch('/api/settings/email', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (emailRes.ok) {
        const data = await emailRes.json();
        setEmailConfig({
          resendKey: data.resendKey ? '••••••••' : '',
          fromEmail: data.fromEmail || '',
          isConfigured: data.isConfigured || false,
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/template', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ template: templateId }),
      });

      if (response.ok) {
        setMessage('✅ Шаблон сохранён');
      } else {
        setMessage('❌ Ошибка сохранения шаблона');
      }
    } catch (error) {
      setMessage('❌ Ошибка сети');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const saveEmailConfig = async () => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/settings/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          resendKey: emailConfig.resendKey === '••••••••' ? undefined : emailConfig.resendKey,
          fromEmail: emailConfig.fromEmail,
        }),
      });
      setEmailConfig(prev => ({ ...prev, isConfigured: true }));
      setMessage('✅ Настройки email сохранены');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Ошибка сохранения');
    }
  };

  const getPreviewStyles = () => {
    switch (selectedTemplate) {
      case 'modern':
        return {
          headerBg: 'bg-gradient-to-r from-purple-500 to-purple-700',
          accentColor: 'text-purple-600',
          accentBg: 'bg-purple-50',
          font: 'font-sans',
          border: 'border-purple-200',
        };
      case 'classic':
        return {
          headerBg: 'bg-gray-800',
          accentColor: 'text-gray-800',
          accentBg: 'bg-gray-50',
          font: 'font-serif',
          border: 'border-gray-400',
        };
      default:
        return {
          headerBg: 'bg-primary-500',
          accentColor: 'text-primary-500',
          accentBg: 'bg-primary-50',
          font: 'font-sans',
          border: 'border-dark-200',
        };
    }
  };

  const preview = getPreviewStyles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-900">Шаблоны PDF</h1>

      {message && (
        <Card className={
          message.includes('✅') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }>
          <div className="p-4 text-sm font-medium">{message}</div>
        </Card>
      )}

      {/* Статус email */}
      <Card className={emailConfig.isConfigured ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emailConfig.isConfigured ? '✅' : '⚠️'}</span>
            <div>
              <h3 className="font-semibold text-dark-900">
                {emailConfig.isConfigured ? 'Email настроен' : 'Email не настроен'}
              </h3>
              <p className="text-sm text-dark-500">
                {emailConfig.isConfigured
                  ? 'PDF будет отправляться клиентам автоматически'
                  : 'Настройте Resend API key для отправки PDF по email'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Настройка Resend */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Настройка отправки email</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Resend API Key</label>
              <input
                type="password"
                value={emailConfig.resendKey}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, resendKey: e.target.value }))}
                placeholder="re_xxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-dark-400 mt-1">
                Получите ключ на <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">resend.com</a> (бесплатно до 100 писем/день)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Email отправителя</label>
              <input
                type="email"
                value={emailConfig.fromEmail}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
                placeholder="noreply@вашдомен.ru"
                className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Button onClick={saveEmailConfig}>
              💾 Сохранить настройки
            </Button>
          </div>
        </div>
      </Card>

      {/* Шаблоны */}
      <h2 className="text-lg font-semibold text-dark-900">Выберите шаблон PDF</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => !isSaving && handleTemplateSelect(template.id)}
            className={`cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'ring-2 ring-primary-500'
                : ''
            } ${isSaving && selectedTemplate === template.id ? 'opacity-70' : ''}`}
          >
            <Card className={`transition-all ${
              selectedTemplate === template.id
                ? 'border-primary-500'
                : 'hover:border-primary-300'
            }`}>
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">{template.preview}</div>
                <h3 className="font-semibold text-dark-900">{template.name}</h3>
                <p className="text-sm text-dark-500 mt-1">{template.description}</p>
                {template.isDefault && (
                  <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    По умолчанию
                  </span>
                )}
                {selectedTemplate === template.id && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    ✓ Выбран
                  </span>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Предпросмотр PDF */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">
            Предпросмотр: {templates.find(t => t.id === selectedTemplate)?.name}
          </h2>
          <div className={`bg-white border ${preview.border} rounded-lg p-8 max-w-2xl mx-auto shadow-sm ${preview.font}`}>
            <div className={`${preview.headerBg} rounded-xl p-6 text-center mb-6`}>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">СП</span>
              </div>
              <h3 className="text-xl font-bold text-white">Коммерческое предложение</h3>
              <p className="text-white/80">от Иванов Фото</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Тип съёмки', value: 'Свадебная фотосессия' },
                { label: 'Количество часов', value: '8 часов' },
                { label: 'Количество фото', value: '500+ обработанных' },
                { label: 'Срок сдачи', value: '14 дней' },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between py-2 border-b ${preview.border}`}>
                  <span className="text-dark-500">{row.label}</span>
                  <span className="font-medium text-dark-900">{row.value}</span>
                </div>
              ))}
            </div>

            <div className={`${preview.accentBg} rounded-lg p-4 mb-6`}>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-dark-900">Итоговая стоимость</span>
                <span className={`text-2xl font-bold ${preview.accentColor}`}>45 000 ₽</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-dark-400 mb-2">Сканируйте QR-код для связи</p>
              <div className="w-24 h-24 bg-dark-100 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-dark-400 text-xs">QR-код</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
