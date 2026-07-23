'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatPrice } from '@/lib/utils';

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

interface QuizData {
  id: string;
  title: string;
  description?: string;
  welcomeMessage: string;
  thankYouMessage: string;
  questions: Question[];
  businessName: string;
  logoUrl?: string;
  phone?: string;
}

interface QuizRendererProps {
  quiz: QuizData;
}

export function QuizRenderer({ quiz }: QuizRendererProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ price: number; pdfUrl?: string } | null>(null);
  const [error, setError] = useState('');

  const totalSteps = quiz.questions.length;
  const currentQuestion = quiz.questions[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    setError('');
  };

  const handleNext = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setError('Это поле обязательно');
      return;
    }
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setError('Это поле обязательно');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/q/${quiz.businessName.toLowerCase().replace(/\s+/g, '-')}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          clientEmail: answers['q6'] || answers['email'],
          clientName: answers['q5'] || answers['name'],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отправки');
      }

      setResult({ price: data.price, pdfUrl: data.pdfUrl });
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Результат
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Готово!</h2>
          <p className="text-dark-600 mb-6">{quiz.thankYouMessage}</p>

          <div className="bg-primary-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-dark-500 mb-1">Итоговая стоимость</p>
            <p className="text-4xl font-bold text-primary-500">{formatPrice(result.price)} ₽</p>
          </div>

          {result.pdfUrl && (
            <a
              href={result.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Скачать PDF
            </a>
          )}

          <p className="text-xs text-dark-400 mt-6">
            PDF также отправлен на вашу почту
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-dark-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          {quiz.logoUrl && (
            <img src={quiz.logoUrl} alt={quiz.businessName} className="h-10 w-auto object-contain" />
          )}
          <div>
            <h1 className="font-semibold text-dark-900">{quiz.businessName}</h1>
            <p className="text-xs text-dark-500">Расчёт стоимости</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-primary-500">
            Вопрос {currentStep + 1} из {totalSteps}
          </span>
          <span className="text-sm text-dark-400">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {currentStep === 0 && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-dark-900 mb-2">{quiz.title}</h2>
            {quiz.description && <p className="text-dark-600">{quiz.description}</p>}
            <p className="text-sm text-dark-500 mt-4 bg-white rounded-lg p-4 border border-dark-100">
              {quiz.welcomeMessage}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-dark-100 p-6 md:p-8">
          <h3 className="text-lg font-semibold text-dark-900 mb-6">
            {currentQuestion.question}
            {currentQuestion.required && <span className="text-primary-500 ml-1">*</span>}
          </h3>

          {/* Single Choice */}
          {currentQuestion.type === 'single_choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                    answers[currentQuestion.id] === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-dark-100 hover:border-primary-300 hover:bg-primary-50/30'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    {answers[currentQuestion.id] === option.value && (
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Multi Choice */}
          {currentQuestion.type === 'multi_choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const currentValues = (answers[currentQuestion.id] as string[]) || [];
                const isSelected = currentValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      const newValues = isSelected
                        ? currentValues.filter(v => v !== option.value)
                        : [...currentValues, option.value];
                      handleAnswer(newValues);
                    }}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-dark-100 hover:border-primary-300 hover:bg-primary-50/30'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded bg-primary-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Number */}
          {currentQuestion.type === 'number' && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const current = parseInt(answers[currentQuestion.id]) || (currentQuestion.default as number) || 1;
                  if (current > (currentQuestion.min || 1)) {
                    handleAnswer(current - 1);
                  }
                }}
                className="w-12 h-12 rounded-xl border-2 border-dark-200 flex items-center justify-center text-dark-600 hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <Input
                type="number"
                min={currentQuestion.min}
                max={currentQuestion.max}
                value={answers[currentQuestion.id] || currentQuestion.default || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="text-center text-xl font-bold flex-1"
              />
              <button
                onClick={() => {
                  const current = parseInt(answers[currentQuestion.id]) || (currentQuestion.default as number) || 0;
                  if (!currentQuestion.max || current < currentQuestion.max) {
                    handleAnswer(current + 1);
                  }
                }}
                className="w-12 h-12 rounded-xl border-2 border-dark-200 flex items-center justify-center text-dark-600 hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}

          {/* Text */}
          {currentQuestion.type === 'text' && (
            <Input
              type={currentQuestion.inputType || 'text'}
              placeholder="Введите ответ..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="text-lg"
            />
          )}

          {error && (
            <p className="mt-4 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Назад
            </Button>
          )}
          <Button
            onClick={isLastStep ? handleSubmit : handleNext}
            isLoading={isSubmitting}
            className="flex-1"
          >
            {isLastStep ? 'Получить КП' : 'Далее'}
            {!isLastStep && (
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-dark-400">
        Сделано с помощью <span className="text-primary-500 font-medium">СДЕЛКА.ПРО</span>
      </div>
    </div>
  );
}
