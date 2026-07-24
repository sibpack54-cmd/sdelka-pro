'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface QuestionOption {
  label: string;
  value: string;
  pricePerHour?: number;
  priceAdd?: number;
  multiplier?: number;
}

interface Question {
  id: string;
  type: 'single_choice' | 'multi_choice' | 'number' | 'text';
  question: string;
  required?: boolean;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  default?: number | string;
  inputType?: string;
}

interface QuizBuilderProps {
  initialQuiz?: {
    id: string;
    title: string;
    description?: string;
    welcomeMessage: string;
    thankYouMessage: string;
    questions: Question[];
    isActive: boolean;
  };
}

export function QuizBuilder({ initialQuiz }: QuizBuilderProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState({
    title: initialQuiz?.title || 'Новый квиз',
    description: initialQuiz?.description || '',
    welcomeMessage: initialQuiz?.welcomeMessage || 'Ответьте на несколько вопросов, чтобы получить расчёт стоимости',
    thankYouMessage: initialQuiz?.thankYouMessage || 'Спасибо! КП отправлено на вашу почту',
    isActive: initialQuiz?.isActive ?? false,
    questions: initialQuiz?.questions || [],
  });

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type,
      question: 'Новый вопрос',
      required: true,
      ...(type === 'single_choice' || type === 'multi_choice' ? {
        options: [
          { label: 'Вариант 1', value: 'option1' },
          { label: 'Вариант 2', value: 'option2' },
        ],
      } : {}),
      ...(type === 'number' ? { min: 1, max: 100, default: 1 } : {}),
      ...(type === 'text' ? { inputType: 'text' } : {}),
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? { ...q, ...updates } : q),
    }));
  };

  const removeQuestion = (index: number) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const addOption = (questionIndex: number) => {
    const question = quiz.questions[questionIndex];
    if (!question.options) return;

    const newOption: QuestionOption = {
      label: `Вариант ${question.options.length + 1}`,
      value: `option${question.options.length + 1}`,
    };

    updateQuestion(questionIndex, {
      options: [...question.options, newOption],
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, updates: Partial<QuestionOption>) => {
    const question = quiz.questions[questionIndex];
    if (!question.options) return;

    updateQuestion(questionIndex, {
      options: question.options.map((o, i) => i === optionIndex ? { ...o, ...updates } : o),
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = quiz.questions[questionIndex];
    if (!question.options || question.options.length <= 2) return;

    updateQuestion(questionIndex, {
      options: question.options.filter((_, i) => i !== optionIndex),
    });
  };

  const handleSave = async () => {
    if (quiz.questions.length === 0) {
      setError('Добавьте хотя бы один вопрос');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = initialQuiz ? `/api/quizzes/${initialQuiz.id}` : '/api/quizzes';
      const method = initialQuiz ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quiz),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сохранения');
      }

      router.push('/dashboard/quiz');
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark-900">
          {initialQuiz ? 'Редактирование квиза' : 'Новый квиз'}
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/dashboard/quiz')}>
            Отмена
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            {initialQuiz ? 'Сохранить' : 'Создать квиз'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Основные настройки */}
      <Card>
        <div className="space-y-4">
          <Input
            label="Название квиза"
            value={quiz.title}
            onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Например: Расчёт стоимости фотосъёмки"
          />
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Описание</label>
            <textarea
              value={quiz.description}
              onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Краткое описание для клиентов"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-200 bg-white text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none h-20"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={quiz.isActive}
              onChange={(e) => setQuiz(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-5 h-5 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm text-dark-700">
              Активен (доступен по ссылке)
            </label>
          </div>
        </div>
      </Card>

      {/* Сообщения */}
      <Card>
        <h3 className="font-semibold text-dark-900 mb-4">Сообщения</h3>
        <div className="space-y-4">
          <Input
            label="Приветственное сообщение"
            value={quiz.welcomeMessage}
            onChange={(e) => setQuiz(prev => ({ ...prev, welcomeMessage: e.target.value }))}
          />
          <Input
            label="Сообщение после завершения"
            value={quiz.thankYouMessage}
            onChange={(e) => setQuiz(prev => ({ ...prev, thankYouMessage: e.target.value }))}
          />
        </div>
      </Card>

      {/* Вопросы */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-dark-900">Вопросы ({quiz.questions.length})</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => addQuestion('single_choice')}>
              + Один вариант
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuestion('multi_choice')}>
              + Несколько
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuestion('number')}>
              + Число
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuestion('text')}>
              + Текст
            </Button>
          </div>
        </div>

        {quiz.questions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-dark-200">
            <p className="text-dark-400">Нажмите кнопку выше, чтобы добавить первый вопрос</p>
          </div>
        )}

        {quiz.questions.map((question, qIndex) => (
          <Card key={question.id} className="relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => {
                  if (qIndex > 0) {
                    const newQuestions = [...quiz.questions];
                    [newQuestions[qIndex], newQuestions[qIndex - 1]] = [newQuestions[qIndex - 1], newQuestions[qIndex]];
                    setQuiz(prev => ({ ...prev, questions: newQuestions }));
                  }
                }}
                disabled={qIndex === 0}
                className="p-1.5 rounded-lg hover:bg-dark-100 disabled:opacity-30 text-dark-500"
              >
                ↑
              </button>
              <button
                onClick={() => {
                  if (qIndex < quiz.questions.length - 1) {
                    const newQuestions = [...quiz.questions];
                    [newQuestions[qIndex], newQuestions[qIndex + 1]] = [newQuestions[qIndex + 1], newQuestions[qIndex]];
                    setQuiz(prev => ({ ...prev, questions: newQuestions }));
                  }
                }}
                disabled={qIndex === quiz.questions.length - 1}
                className="p-1.5 rounded-lg hover:bg-dark-100 disabled:opacity-30 text-dark-500"
              >
                ↓
              </button>
              <button
                onClick={() => removeQuestion(qIndex)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
              >
                🗑️
              </button>
            </div>

            <div className="space-y-4 pr-24">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-1 rounded">
                  {qIndex + 1}
                </span>
                <span className="text-xs text-dark-400 uppercase">
                  {question.type === 'single_choice' && 'Один вариант'}
                  {question.type === 'multi_choice' && 'Несколько вариантов'}
                  {question.type === 'number' && 'Число'}
                  {question.type === 'text' && 'Текст'}
                </span>
              </div>

              <Input
                value={question.question}
                onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                placeholder="Текст вопроса"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`required-${question.id}`}
                  checked={question.required}
                  onChange={(e) => updateQuestion(qIndex, { required: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-300 text-primary-500"
                />
                <label htmlFor={`required-${question.id}`} className="text-sm text-dark-600">
                  Обязательный вопрос
                </label>
              </div>

              {/* Опции для выбора */}
              {(question.type === 'single_choice' || question.type === 'multi_choice') && question.options && (
                <div className="space-y-2 pl-4 border-l-2 border-primary-100">
                  <p className="text-sm font-medium text-dark-600 mb-2">Варианты ответа:</p>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => updateOption(qIndex, oIndex, { label: e.target.value })}
                        placeholder="Название"
                        className="flex-1 px-3 py-2 rounded-lg border border-dark-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => updateOption(qIndex, oIndex, { value: e.target.value })}
                        placeholder="Код"
                        className="w-32 px-3 py-2 rounded-lg border border-dark-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number"
                        value={option.pricePerHour || option.priceAdd || option.multiplier || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (question.type === 'single_choice') {
                            updateOption(qIndex, oIndex, { pricePerHour: val || undefined });
                          } else if (question.type === 'multi_choice') {
                            updateOption(qIndex, oIndex, { priceAdd: val || undefined });
                          }
                        }}
                        placeholder="Цена"
                        className="w-24 px-3 py-2 rounded-lg border border-dark-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={() => removeOption(qIndex, oIndex)}
                        disabled={(question.options?.length ?? 0) <= 2}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 disabled:opacity-30"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => addOption(qIndex)}>
                    + Добавить вариант
                  </Button>
                </div>
              )}

              {/* Настройки числа */}
              {question.type === 'number' && (
                <div className="flex gap-4 pl-4 border-l-2 border-primary-100">
                  <Input
                    label="Минимум"
                    type="number"
                    value={question.min || ''}
                    onChange={(e) => updateQuestion(qIndex, { min: parseInt(e.target.value) || 1 })}
                    className="w-24"
                  />
                  <Input
                    label="Максимум"
                    type="number"
                    value={question.max || ''}
                    onChange={(e) => updateQuestion(qIndex, { max: parseInt(e.target.value) || 100 })}
                    className="w-24"
                  />
                  <Input
                    label="По умолчанию"
                    type="number"
                    value={question.default || ''}
                    onChange={(e) => updateQuestion(qIndex, { default: parseInt(e.target.value) || 1 })}
                    className="w-24"
                  />
                </div>
              )}

              {/* Настройки текста */}
              {question.type === 'text' && (
                <div className="pl-4 border-l-2 border-primary-100">
                  <select
                    value={question.inputType || 'text'}
                    onChange={(e) => updateQuestion(qIndex, { inputType: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-dark-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="text">Текст</option>
                    <option value="email">Email</option>
                    <option value="tel">Телефон</option>
                  </select>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
