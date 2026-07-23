'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface Submission {
  id: string;
  answers: Record<string, any>;
  calculatedPrice: number;
  clientEmail: string;
  clientName: string | null;
  pdfUrl: string | null;
  status: string;
  createdAt: string;
}

export default function SubmissionsPage() {
  const params = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, [params.id]);

  const loadSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quizzes/${params.id}/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Лиды</h1>
          <p className="text-dark-500">Клиенты, прошедшие квиз</p>
        </div>
        <Link href="/dashboard/quiz">
          <Button variant="outline">← Назад к квизам</Button>
        </Link>
      </div>

      {submissions.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-dark-900 mb-2">Пока нет лидов</h3>
          <p className="text-dark-500">Поделитесь ссылкой на квиз, чтобы получить первых клиентов</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <Card key={sub.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-dark-900">
                      {sub.clientName || sub.answers['q5'] || 'Клиент'}
                    </h4>
                    <span className={sub.status === 'email_sent'
                      ? 'text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700'
                      : 'text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700'
                    }>
                      {sub.status === 'email_sent' ? '✓ Email отправлен' : '✗ Ошибка'}
                    </span>
                  </div>
                  <p className="text-sm text-dark-500 mb-2">{sub.clientEmail}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-primary-500">
                      {formatPrice(sub.calculatedPrice)} ₽
                    </span>
                    <span className="text-dark-400">
                      {new Date(sub.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                {sub.pdfUrl && (
                  <a
                    href={sub.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    PDF
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
