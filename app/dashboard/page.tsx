'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Динамический импорт recharts (SSR-safe)
const DynamicChart = () => {
  const [ChartComponent, setChartComponent] = useState<any>(null);

  useEffect(() => {
    import('recharts').then((mod) => {
      setChartComponent(() => mod);
    });
  }, []);

  return ChartComponent;
};

interface QuizListItem {
  id: string;
  title: string;
  isActive: boolean;
  _count: { submissions: number };
  createdAt: string;
}

interface DailyStat {
  date: string;
  submissions: number;
}

interface DashboardStats {
  activeQuizzes: number;
  totalSubmissions: number;
  totalLeads: number;
  totalViews: number;
  conversionRate: number;
  dailyData: DailyStat[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartMod, setChartMod] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadData();
    // Загружаем recharts
    import('recharts').then(setChartMod);
  }, [router]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch quizzes
      const quizzesResponse = await fetch('/api/quizzes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const quizzesData = await quizzesResponse.json();

      // Fetch daily stats
      const statsResponse = await fetch('/api/stats/daily?days=7', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const statsData = await statsResponse.json();

      if (quizzesResponse.ok) {
        const quizzes = quizzesData.quizzes || [];
        setRecentQuizzes(quizzes.slice(0, 5));

        const activeQuizzes = quizzes.filter((q: QuizListItem) => q.isActive).length;
        const totalSubmissions = quizzes.reduce((sum: number, q: QuizListItem) => sum + q._count.submissions, 0);

        setStats({
          activeQuizzes,
          totalSubmissions,
          totalLeads: totalSubmissions,
          totalViews: statsData.stats?.totalViews || 0,
          conversionRate: statsData.stats?.conversionRate || 0,
          dailyData: statsData.data || [],
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = () => {
    if (!chartMod || !stats?.dailyData?.length) return null;

    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = chartMod;

    return (
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats.dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              labelStyle={{ color: '#374151' }}
            />
            <Line 
              type="monotone" 
              dataKey="submissions" 
              stroke="#8B5CF6" 
              strokeWidth={2} 
              dot={{ fill: '#8B5CF6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
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
        <h1 className="text-2xl font-bold text-dark-900">Обзор</h1>
        <Link href="/dashboard/quiz/new">
          <Button>+ Новый квиз</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-3xl font-bold text-primary-500">{stats?.activeQuizzes || 0}</div>
          <div className="text-sm text-dark-500 mt-1">Активных квизов</div>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-primary-500">{stats?.totalViews || 0}</div>
          <div className="text-sm text-dark-500 mt-1">Просмотров</div>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-primary-500">{stats?.totalSubmissions || 0}</div>
          <div className="text-sm text-dark-500 mt-1">Заявок</div>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-green-500">{stats?.conversionRate || 0}%</div>
          <div className="text-sm text-dark-500 mt-1">Конверсия</div>
        </Card>
      </div>

      {/* Chart */}
      {stats?.dailyData && stats.dailyData.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-dark-900 mb-2">📈 Заявки по дням</h3>
            {renderChart()}
          </div>
        </Card>
      )}

      {/* Recent Quizzes */}
      <Card>
        <CardHeader
          title="Ваши квизы"
          subtitle="Последние обновлённые квизы"
          action={
            <Link href="/dashboard/quiz">
              <Button variant="ghost" size="sm">Все квизы →</Button>
            </Link>
          }
        />
        <div className="space-y-3">
          {recentQuizzes.length === 0 ? (
            <div className="text-center py-8 text-dark-500">Нет квизов</div>
          ) : (
            recentQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-4 rounded-xl border border-dark-100 hover:border-primary-300 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-dark-900">{quiz.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-dark-500">
                    <span className={quiz.isActive ? 'text-green-600' : 'text-amber-600'}>
                      {quiz.isActive ? '● Активен' : '● Черновик'}
                    </span>
                    <span>{quiz._count.submissions} заявок</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/quiz/${quiz.id}`}>
                    <Button variant="outline" size="sm">Редактировать</Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Start */}
      {recentQuizzes.length === 0 && (
        <Card className="bg-gradient-to-r from-primary-50 to-white border-primary-100">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-dark-900 mb-2">Быстрый старт</h3>
            <p className="text-dark-600 mb-4">
              Создайте свой первый квиз и начните получать лиды уже сегодня
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard/quiz/new">
                <Button>Создать квиз</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
