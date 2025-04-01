import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { respuestas } from '@/src/db/schema';

export async function POST(request: Request) {
  try {
    const { grade, responses } = await request.json();
    
    // Crear objeto mapeado
    const respuestasMap: Record<number, string> = {};
    responses.forEach(({ questionId, answer }: { questionId: number; answer: string }) => {
      respuestasMap[questionId] = answer;
    });

    // Insertar con la nueva estructura
    await db.insert(respuestas).values({
      grade,
      respuesta2: respuestasMap[2] || null,
      respuesta3: respuestasMap[3] || null,
      respuesta4: respuestasMap[4] || null,
      respuesta5: respuestasMap[5] || null,
      respuesta6: respuestasMap[6] || null,
      respuesta7: respuestasMap[7] || null,
      respuesta8: respuestasMap[8] || null,
      respuesta9: respuestasMap[9] || null,
      respuesta10: respuestasMap[10] || null,
      respuesta11: respuestasMap[11] || null,
    });

    return NextResponse.json({ message: 'Respuestas guardadas exitosamente' });
  } catch (error) {
    console.error('Error al guardar las respuestas:', error);
    return NextResponse.json({ error: 'Error al guardar las respuestas' }, { status: 500 });
  }
}