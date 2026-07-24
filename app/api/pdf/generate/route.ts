import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf/generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pdfBuffer = await generatePDF(body);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="kp.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generate error:', error);
    return NextResponse.json(
      { error: 'Ошибка генерации PDF' },
      { status: 500 }
    );
  }
}
