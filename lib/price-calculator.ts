export interface QuestionOption {
  label: string;
  value: string;
  pricePerHour?: number;
  priceAdd?: number;
  multiplier?: number;
}

export interface Question {
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

export function calculatePrice(
  questions: Question[],
  answers: Record<string, any>,
  formula?: string | null
): number {
  // Если есть формула — используем её (для продвинутых пользователей)
  if (formula) {
    try {
      const fn = new Function('answers', `with(answers) { return ${formula} }`);
      return Math.round(fn(answers));
    } catch {
      // fallback на стандартную логику
    }
  }

  // Стандартная логика для фотографов
  let price = 0;
  let hourlyRate = 3000; // дефолт
  let hours = 2;
  let urgencyMultiplier = 1;

  // Находим тип съёмки (q1) и ставку
  const q1 = questions.find(q => q.id === 'q1');
  if (q1 && q1.options) {
    const selectedType = answers['q1'];
    const option = q1.options.find(o => o.value === selectedType);
    if (option?.pricePerHour) {
      hourlyRate = option.pricePerHour;
    }
  }

  // Количество часов (q2)
  const q2 = questions.find(q => q.id === 'q2');
  if (q2) {
    hours = parseInt(String(answers['q2'])) || Number(q2.default) || 2;
  }

  // Базовая стоимость
  price = hourlyRate * hours;

  // Дополнительные услуги (q3)
  const q3 = questions.find(q => q.id === 'q3');
  if (q3 && q3.options && Array.isArray(answers['q3'])) {
    for (const extraValue of answers['q3']) {
      const option = q3.options.find(o => o.value === extraValue);
      if (option?.priceAdd) {
        price += option.priceAdd;
      }
    }
  }

  // Срочность (q4)
  const q4 = questions.find(q => q.id === 'q4');
  if (q4 && q4.options) {
    const selectedUrgency = answers['q4'];
    const option = q4.options.find(o => o.value === selectedUrgency);
    if (option?.multiplier) {
      urgencyMultiplier = option.multiplier;
    }
  }

  price *= urgencyMultiplier;

  return Math.round(price);
}
