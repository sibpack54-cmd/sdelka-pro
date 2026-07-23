export interface User {
  id: string;
  email: string;
  businessName: string | null;
  slug: string;
  logoUrl: string | null;
  phone: string | null;
  emailNotifications: boolean;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isActive: boolean;
  questions: Question[];
  pricingFormula: string | null;
  welcomeMessage: string;
  thankYouMessage: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    submissions: number;
  };
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

export interface QuestionOption {
  label: string;
  value: string;
  pricePerHour?: number;
  priceAdd?: number;
  multiplier?: number;
}

export interface Submission {
  id: string;
  quizId: string;
  answers: Record<string, any>;
  calculatedPrice: number;
  clientEmail: string;
  clientName: string | null;
  pdfUrl: string | null;
  status: 'completed' | 'email_sent' | 'error';
  createdAt: Date;
}

export interface PdfTemplate {
  id: string;
  userId: string | null;
  name: string;
  htmlContent: string;
  cssContent: string | null;
  isDefault: boolean;
  createdAt: Date;
}
