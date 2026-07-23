'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuizBuilder } from '@/components/QuizBuilder/QuizBuilder';

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadQuiz();
  }, [params.id, router]);

  const loadQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quizzes/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setQuiz(data.quiz);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
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

  if (!quiz) {
    return (
      <div className="text-center py-16">
        <p className="text-dark-500">Квиз не найден</p>
      </div>
    );
  }

  return <QuizBuilder initialQuiz={quiz} />;
}
