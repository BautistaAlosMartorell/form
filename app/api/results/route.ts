import { db } from '@/src/db';
import { respuestas } from '@/src/db/schema';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const results = await db.select().from(respuestas);
    
    const analysis = {
      global: {} as Record<string, Record<string, number>>,
      byGrade: {} as Record<string, Record<string, Record<string, number>>>,
      total: results.length
    };

    // Análisis para todas las preguntas
    for (let q = 2; q <= 11; q++) {
      const questionKey = `P${q}`;
      analysis.global[questionKey] = {};
      
      results.forEach(res => {
        const answer = res[`respuesta${q}` as keyof typeof res];
        if (answer) {
          analysis.global[questionKey][answer] = (analysis.global[questionKey][answer] || 0) + 1;
          
          const grade = res.grade;
          analysis.byGrade[grade] = analysis.byGrade[grade] || {};
          analysis.byGrade[grade][questionKey] = analysis.byGrade[grade][questionKey] || {};
          analysis.byGrade[grade][questionKey][answer] = (analysis.byGrade[grade][questionKey][answer] || 0) + 1;
        }
      });
    }

    return NextResponse.json(analysis);
    
  } catch (error) {
    console.error('Error en API:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos', details: (error as Error).message },
      { status: 500 }
    );
  }
}