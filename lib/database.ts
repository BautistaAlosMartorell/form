// lib/database.ts
import { db } from "@/src/db";
import { respuestas } from "@/src/db/schema";
// lib/database.ts
export const getCompleteAnalysis = async () => {
  const results = await db.select().from(respuestas).all();
  
  // Analizar todas las preguntas (2-11)
  const questionAnalysis: Record<string, Record<string, number>> = {};
  const gradeAnalysis: Record<string, Record<string, Record<string, number>>> = {};

  // Inicializar estructura
  for (let q = 2; q <= 11; q++) {
    questionAnalysis[`P${q}`] = {};
    results.forEach(res => {
      const answer = res[`respuesta${q}` as keyof typeof res];
      if (answer) {
        questionAnalysis[`P${q}`][answer] = (questionAnalysis[`P${q}`][answer] || 0) + 1;
        
        const grade = res.grade;
        gradeAnalysis[grade] = gradeAnalysis[grade] || {};
        gradeAnalysis[grade][`P${q}`] = gradeAnalysis[grade][`P${q}`] || {};
        gradeAnalysis[grade][`P${q}`][answer] = (gradeAnalysis[grade][`P${q}`][answer] || 0) + 1;
      }
    });
  }

  return {
    global: questionAnalysis,
    byGrade: gradeAnalysis,
    total: results.length
  };
};