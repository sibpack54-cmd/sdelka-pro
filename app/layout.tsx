import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'СДЕЛКА.ПРО — Конструктор КП для бизнеса',
  description: 'Создавайте квизы и коммерческие предложения за 10 минут. Без программирования.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
