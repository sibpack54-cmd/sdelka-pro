'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

interface QuizListItem {
  id: string;
  title: string;
  isActive: boolean;
  _count: { submissions: number };
  createdAt: string;
}

export default function QuizListPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadQuizzes();
  }, [router]);

  const loadQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quizzes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setQuizzes(data.quizzes);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/quizzes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !current }),
      });
      loadQuizzes();
    } catch (error) {
      console.error('Error toggling quiz:', error);
    }
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm('Удалить квиз? Это действие нельзя отменить.')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/quizzes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      loadQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
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
        <h1 className="text-2xl font-bold text-dark-900">Мои квизы</h1>
        <Link href="/dashboard/quiz/new">
          <Button>+ Новый квиз</Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-dark-900 mb-2">У вас пока нет квизов</h3>
          <p className="text-dark-500 mb-6">Создайте первый квиз и начните получать лиды</p>
          <Link href="/dashboard/quiz/new">
            <Button>Создать квиз</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:border-primary-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-dark-900">{quiz.title}</h3>
                    <span className={quiz.isActive 
                      ? 'text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700'
                      : 'text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700'
                    }>
                      {quiz.isActive ? 'Активен' : 'Черновик'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-dark-500">
                    <span>{quiz._count.submissions} лидов</span>
                    <span>Создан: {new Date(quiz.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(quiz.id, quiz.isActive)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-dark-200 hover:bg-dark-50 transition-colors"
                  >
                    {quiz.isActive ? 'Деактивировать' : 'Активировать'}
                  </button>
                  <Link href={`/dashboard/quiz/${quiz.id}`}>
                    <Button variant="outline" size="sm">Редактировать</Button>
                  </Link>
                  <Link href={`/dashboard/quiz/${quiz.id}/submissions`}>
                    <Button variant="ghost" size="sm">Лиды</Button>
                  </Link>
                  <button
                    onClick={() => deleteQuiz(quiz.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
