import { prisma } from '@/lib/db/prisma';
import { QuizRenderer } from '@/components/QuizRenderer/QuizRenderer';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicQuizPage({ params }: PageProps) {
  const { slug } = await params;
  
  const quiz = await prisma.quiz.findFirst({
    where: {
      user: { slug },
      isActive: true,
    },
    include: {
      user: {
        select: {
          businessName: true,
          logoUrl: true,
          phone: true,
          slug: true,
        },
      },
    },
  });

  if (!quiz) {
    notFound();
  }

  return (
    <QuizRenderer
      quiz={{
        id: quiz.id,
        title: quiz.title,
        description: quiz.description || undefined,
        welcomeMessage: quiz.welcomeMessage,
        thankYouMessage: quiz.thankYouMessage,
        questions: Array.isArray(quiz.questions) ? quiz.questions : JSON.parse(quiz.questions as string),
        businessName: quiz.user.businessName || 'Бизнес',
        logoUrl: quiz.user.logoUrl || undefined,
        phone: quiz.user.phone || undefined,
      }}
    />
  );
}
