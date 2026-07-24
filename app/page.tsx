'use client';  // ✅ ДОБАВИТЬ ЭТУ СТРОКУ

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '📝',
    title: 'Создавайте квизы',
    description: 'Конструктор с вопросами, вариантами ответов и формулами цен',
    gradient: 'from-orange-500/10 to-violet-500/10',
  },
  {
    icon: '📄',
    title: 'Генерируйте PDF',
    description: 'Автоматическое создание коммерческих предложений в 3 стилях',
    gradient: 'from-violet-500/10 to-orange-500/10',
  },
  {
    icon: '📧',
    title: 'Отправляйте email',
    description: 'Мгновенная отправка PDF клиенту на почту через Resend',
    gradient: 'from-orange-500/10 to-violet-500/10',
  },
  {
    icon: '📊',
    title: 'Собирайте лиды',
    description: 'Все заявки в одном месте — в вашем дашборде с аналитикой',
    gradient: 'from-violet-500/10 to-orange-500/10',
  },
];

const examples = [
  {
    business: 'Иванов Фото',
    type: 'Фотограф',
    description: 'Расчёт стоимости свадебной фотосъёмки с выбором пакета',
    link: '/q/ivanov-photo',
    color: 'from-pink-500 to-rose-500',
    emoji: '📸',
  },
  {
    business: 'СтройМастер',
    type: 'Ремонт квартир',
    description: 'Расчёт стоимости ремонта по типу квартиры и материалам',
    link: '#',
    color: 'from-blue-500 to-cyan-500',
    emoji: '🔨',
  },
  {
    business: 'Цветочный рай',
    type: 'Флористика',
    description: 'Подбор букета по поводу, бюджету и предпочтениям',
    link: '#',
    color: 'from-emerald-500 to-green-500',
    emoji: '🌺',
  },
];

const testimonials = [
  {
    name: 'Анна Петрова',
    business: 'Фотограф, г. Москва',
    text: 'Квизы помогли мне автоматизировать расчёт стоимости. Теперь клиенты сами видят цену и сразу заказывают!',
    avatar: '👩‍💼',
    rating: 5,
  },
  {
    name: 'Михаил Сидоров',
    business: 'Ремонт квартир, г. СПб',
    text: 'Увеличили конверсию на 40% благодаря точным расчётам. Клиенты доверяют цифрам из квиза.',
    avatar: '👨‍🔧',
    rating: 5,
  },
  {
    name: 'Елена Козлова',
    business: 'Флорист, г. Новосибирск',
    text: 'PDF-предложения выглядят профессионально. Клиенты часто хвалят дизайн и понятность расчётов.',
    avatar: '👩‍🌾',
    rating: 5,
  },
];

const pricing = [
  {
    name: 'Старт',
    price: '0 ₽',
    period: 'навсегда',
    features: ['1 активный квиз', 'До 50 прохождений/мес', 'Базовый PDF шаблон', 'Email-уведомления'],
    cta: 'Начать бесплатно',
    popular: false,
  },
  {
    name: 'Про',
    price: '990 ₽',
    period: '/месяц',
    features: [
      'Неограниченные квизы',
      'Безлимитные прохождения',
      'Все 3 шаблона PDF',
      'Кастомный логотип в PDF',
      'Приоритетная поддержка',
    ],
    cta: 'Подключить Про',
    popular: true,
  },
  {
    name: 'Бизнес',
    price: '2 990 ₽',
    period: '/месяц',
    features: [
      'Всё из Про',
      'Несколько менеджеров',
      'API доступ',
      'White-label решение',
      'Персональный менеджер',
    ],
    cta: 'Связаться с нами',
    popular: false,
  },
];

const stats = [
  { value: '500+', label: 'Активных пользователей' },
  { value: '10K+', label: 'Созданных квизов' },
  { value: '50K+', label: 'Прохождений' },
  { value: '40%', label: 'Рост конверсии' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-violet-50 py-20 px-4">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/logo-main.png" alt="СДЕЛКА.ПРО" className="w-12 h-12" />
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-violet-500 bg-clip-text text-transparent">
              СДЕЛКА.ПРО
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Квизы, которые{' '}
            <span className="bg-gradient-to-r from-orange-500 to-violet-500 bg-clip-text text-transparent">
              продают
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Создавайте интерактивные квизы для клиентов. Автоматически генерируйте 
            коммерческие предложения в PDF и отправляйте на email.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-orange-500 to-violet-500 hover:from-orange-600 hover:to-violet-600 border-0 shadow-lg shadow-orange-500/25">
                🚀 Создать квиз бесплатно
              </Button>
            </Link>
            <Link href="/q/ivanov-photo">
              <Button variant="outline" size="lg" className="text-lg px-8 border-2 hover:border-orange-500 hover:text-orange-500">
                👀 Посмотреть пример
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Бесплатно
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Без карты
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              5 минут
            </span>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 text-center mb-4">
            Как это работает
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-center mb-12">
            Всё просто: создайте квиз, опубликуйте и получайте заявки
          </motion.p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`text-center p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-gray-100 hover:border-orange-200 transition-all duration-300`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Examples */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Примеры квизов
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Посмотрите, как выглядят квизы для разных бизнесов
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {examples.map((example, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`h-2 bg-gradient-to-r ${example.color}`} />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{example.emoji}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${example.color} text-white`}>
                      {example.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{example.business}</h3>
                  <p className="text-sm text-gray-500 mb-4">{example.description}</p>
                  <Link href={example.link}>
                    <Button variant="outline" size="sm" className="w-full group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
                      Открыть квиз →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Отзывы пользователей
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Что говорят наши клиенты о СДЕЛКА.ПРО
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-violet-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.business}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-violet-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Тарифы
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Начните бесплатно, масштабируйтесь по мере роста
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {pricing.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={`relative rounded-2xl border p-6 ${
                  plan.popular
                    ? 'border-orange-500 shadow-xl shadow-orange-500/10 bg-white'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-orange-500 to-violet-500 text-white text-xs font-medium rounded-full">
                      Популярный
                    </span>
                  </div>
                )}
                
                <h3 className="text-lg font-semibold text-gray-900 mt-2">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href="/register">
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-violet-500 hover:from-orange-600 hover:to-violet-600 border-0 shadow-lg shadow-orange-500/25' : ''}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-violet-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы получать больше заявок?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Создайте первый квиз за 5 минут и начните конвертировать посетителей в клиентов
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 bg-white text-orange-500 hover:bg-gray-50 hover:text-orange-600 shadow-xl">
              🚀 Начать бесплатно
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo-main.png" alt="СДЕЛКА.ПРО" className="w-8 h-8" />
            <span className="font-semibold text-gray-900">СДЕЛКА.ПРО</span>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-gray-900 transition-colors">Вход</Link>
            <Link href="/register" className="hover:text-gray-900 transition-colors">Регистрация</Link>
            <a href="mailto:support@sdelka.pro" className="hover:text-gray-900 transition-colors">Поддержка</a>
          </div>
          
          <p className="text-sm text-gray-400">© 2026 СДЕЛКА.ПРО</p>
        </div>
      </footer>
    </div>
  );
}
