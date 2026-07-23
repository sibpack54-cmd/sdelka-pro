import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: '📝',
    title: 'Создавайте квизы',
    description: 'Конструктор с вопросами, вариантами ответов и формулами цен',
  },
  {
    icon: '📄',
    title: 'Генерируйте PDF',
    description: 'Автоматическое создание коммерческих предложений',
  },
  {
    icon: '📧',
    title: 'Отправляйте email',
    description: 'Мгновенная отправка PDF клиенту на почту',
  },
  {
    icon: '📊',
    title: 'Собирайте лиды',
    description: 'Все заявки в одном месте — в вашем дашборде',
  },
];

const examples = [
  {
    business: 'Иванов Фото',
    type: 'Фотограф',
    description: 'Квиз для расчёта стоимости свадебной фотосъёмки',
    link: '/q/ivanov-photo',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    business: 'СтройМастер',
    type: 'Ремонт квартир',
    description: 'Расчёт стоимости ремонта по типу квартиры',
    link: '#',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    business: 'Цветочный магазин',
    type: 'Флористика',
    description: 'Подбор букета по поводу и бюджету',
    link: '#',
    color: 'bg-green-100 text-green-700',
  },
];

const testimonials = [
  {
    name: 'Анна Петрова',
    business: 'Фотограф',
    text: 'Квизы помогли мне автоматизировать расчёт стоимости. Теперь клиенты сами видят цену и сразу заказывают!',
    avatar: '👩‍💼',
  },
  {
    name: 'Михаил Сидоров',
    business: 'Ремонт квартир',
    text: 'Увеличили конверсию на 40% благодаря точным расчётам. Клиенты доверяют цифрам из квиза.',
    avatar: '👨‍🔧',
  },
  {
    name: 'Елена Козлова',
    business: 'Флорист',
    text: 'PDF-предложения выглядят профессионально. Клиенты часто хвалят дизайн и понятность.',
    avatar: '👩‍🌾',
  },
];

const pricing = [
  {
    name: 'Старт',
    price: '0 ₽',
    period: 'навсегда',
    features: ['1 активный квиз', 'До 50 прохождений/мес', 'Базовый PDF', 'Email-уведомления'],
    cta: 'Начать бесплатно',
    popular: false,
  },
  {
    name: 'Про',
    price: '990 ₽',
    period: '/месяц',
    features: ['Неограниченные квизы', 'Безлимитные прохождения', 'Кастомный PDF + логотип', 'Приоритетная поддержка'],
    cta: 'Подключить Про',
    popular: true,
  },
  {
    name: 'Бизнес',
    price: '2 990 ₽',
    period: '/месяц',
    features: ['Всё из Про', 'Несколько менеджеров', 'API доступ', 'White-label решение'],
    cta: 'Связаться',
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">СП</span>
            </div>
            <span className="text-2xl font-bold text-dark-900">СДЕЛКА.ПРО</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-dark-900 mb-6">
            Квизы, которые продают
          </h1>
          <p className="text-xl text-dark-500 mb-8 max-w-2xl mx-auto">
            Создавайте интерактивные квизы для клиентов. Автоматически генерируйте 
            коммерческие предложения в PDF и отправляйте на email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                🚀 Создать квиз бесплатно
              </Button>
            </Link>
            <Link href="/q/ivanov-photo">
              <Button variant="outline" size="lg" className="text-lg px-8">
                👀 Посмотреть пример
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-dark-900 text-center mb-12">
            Как это работает
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white border border-dark-100 hover:border-primary-300 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-dark-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-dark-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-16 px-4 bg-dark-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-dark-900 text-center mb-4">
            Примеры квизов
          </h2>
          <p className="text-dark-500 text-center mb-12">
            Посмотрите, как выглядят квизы для разных бизнесов
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {examples.map((example, i) => (
              <div key={i} className="bg-white rounded-2xl border border-dark-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${example.color}`}>
                      {example.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-dark-900 mb-2">{example.business}</h3>
                  <p className="text-sm text-dark-500 mb-4">{example.description}</p>
                  <Link href={example.link}>
                    <Button variant="outline" size="sm" className="w-full">
                      Открыть квиз →
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-dark-900 text-center mb-4">
            Отзывы пользователей
          </h2>
          <p className="text-dark-500 text-center mb-12">
            Что говорят наши клиенты о СДЕЛКА.ПРО
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl border border-dark-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-900">{testimonial.name}</h4>
                    <p className="text-sm text-dark-500">{testimonial.business}</p>
                  </div>
                </div>
                <p className="text-dark-600 text-sm leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-dark-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Активных пользователей' },
              { value: '10K+', label: 'Созданных квизов' },
              { value: '50K+', label: 'Прохождений' },
              { value: '40%', label: 'Рост конверсии' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-primary-400 mb-2">{stat.value}</div>
                <div className="text-dark-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-dark-900 text-center mb-4">
            Тарифы
          </h2>
          <p className="text-dark-500 text-center mb-12">
            Начните бесплатно, масштабируйтесь по мере роста
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {pricing.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-6 ${
                  plan.popular
                    ? 'border-primary-500 ring-2 ring-primary-500 bg-primary-50'
                    : 'border-dark-100 bg-white'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full mb-4">
                    Популярный
                  </span>
                )}
                <h3 className="text-lg font-semibold text-dark-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-dark-900">{plan.price}</span>
                  <span className="text-dark-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-dark-600">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы получать больше заявок?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Создайте первый квиз за 5 минут и начните конвертировать посетителей в клиентов
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 bg-white text-primary-500 hover:bg-primary-50">
              🚀 Начать бесплатно
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-dark-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">СП</span>
            </div>
            <span className="font-semibold text-dark-900">СДЕЛКА.ПРО</span>
          </div>
          <div className="flex gap-6 text-sm text-dark-500">
            <Link href="/login" className="hover:text-dark-900">Вход</Link>
            <Link href="/register" className="hover:text-dark-900">Регистрация</Link>
            <a href="mailto:support@sdelka.pro" className="hover:text-dark-900">Поддержка</a>
          </div>
          <p className="text-sm text-dark-400">© 2026 СДЕЛКА.ПРО</p>
        </div>
      </footer>
    </div>
  );
}
