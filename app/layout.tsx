import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'СДЕЛКА.ПРО — Квизы, которые продают',
  description: 'Создавайте интерактивные квизы, генерируйте PDF и получайте заявки. Автоматизация продаж для фотографов, ремонтных бригад, флористов и любого бизнеса.',
  keywords: 'квизы, конструктор квизов, коммерческое предложение, PDF, автоматизация продаж, лидогенерация',
  authors: [{ name: 'СДЕЛКА.ПРО' }],
  creator: 'СДЕЛКА.ПРО',
  publisher: 'СДЕЛКА.ПРО',
  robots: 'index, follow',
  metadataBase: new URL('https://sdelka.pro'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'СДЕЛКА.ПРО — Квизы, которые продают',
    description: 'Создавайте интерактивные квизы, генерируйте PDF и получайте заявки. Автоматизация продаж для любого бизнеса.',
    url: 'https://sdelka.pro',
    siteName: 'СДЕЛКА.ПРО',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'СДЕЛКА.ПРО — Квизы, которые продают',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'СДЕЛКА.ПРО — Квизы, которые продают',
    description: 'Создавайте интерактивные квизы, генерируйте PDF и получайте заявки.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'ваш_код_верификации',
    yandex: 'ваш_код_верификации',
  },
};

// ✅ ВЫНЕСЕНО В ОТДЕЛЬНЫЙ ЭКСПОРТ
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FF6B35',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta name="format-detection" content="telephone=no" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="СДЕЛКА.ПРО" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sdelkapro" />
        <meta name="twitter:creator" content="@sdelkapro" />
        <link rel="dns-prefetch" href="https://api.resend.com" />
        <link rel="dns-prefetch" href="https://api.telegram.org" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="alternate" type="application/rss+xml" title="СДЕЛКА.ПРО" href="/feed.xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
