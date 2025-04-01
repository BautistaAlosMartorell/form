'use client';

import { BarChart, PieChart } from './ChartWrapper';
import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

type QuestionKey = `P${2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11}`;

interface SurveyAnalysis {
  global: Record<QuestionKey, Record<string, number>>;
  byGrade: Record<string, Record<QuestionKey, Record<string, number>>>;
  total: number;
}

const QUESTION_TEXTS: Record<QuestionKey, string> = {
  P2: "¿Vio situaciones problemáticas?",
  P3: "Tipo de situación",
  P4: "Frecuencia",
  P5: "¿Se resolvió?",
  P6: "¿Quién ayudó?",
  P7: "¿Reportó a adulto?",
  P8: "Efectividad respuesta",
  P9: "Emociones experimentadas",
  P10: "Ambiente escolar",
  P11: "Medidas sugeridas"
};

const GRADE_NAMES: Record<string, string> = {
  "Primer grado": "1° Grado",
  "Segundo grado": "2° Grado",
  "Tercer grado": "3° Grado",
  "Cuarto grado": "4° Grado",
  "Quinto grado": "5° Grado",
  "Sexto grado": "6° Grado",
  "Séptimo grado": "7° Grado"
};

const DEFAULT_COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#34495e'];

export default function CompleteAnalysis() {
  const [data, setData] = useState<SurveyAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/results?t=${Date.now()}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      
      const result = await response.json();
      
      // Validar estructura de datos
      if (!result || typeof result.total !== 'number' || !result.global || !result.byGrade) {
        throw new Error('Formato de datos inválido');
      }

      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };
  
  const getQuestionData = (questionKey: QuestionKey, data: any) => {
    return data.global[questionKey] 
      ? Object.entries(data.global[questionKey]).sort((a, b) => b[1] - a[1])
      : [];
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-8 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl p-4">
              <div className="h-4 bg-gray-200 w-1/2 mb-4" />
              <div className="h-40 bg-gray-300 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Error al cargar datos
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (!data?.total) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Base de datos vacía
          </h2>
          <p className="text-gray-600">
            Aún no hay respuestas registradas. Vuelve a revisar cuando los estudiantes hayan completado las encuestas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Panel Analítico Completo
        </h1>
        <div className="bg-emerald-50 inline-block px-4 py-2 rounded-lg">
          <span className="font-semibold text-emerald-800">
            Total de encuestas: {data.total.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Sección de preguntas globales */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Análisis General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.entries(data.global) as [QuestionKey, Record<string, number>][]).map(([questionKey, answers]) => (
            <div key={questionKey} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-3 text-gray-700">
                {QUESTION_TEXTS[questionKey]}
              </h3>
              <div className="h-60">
                <PieChart
                  data={{
                    labels: Object.keys(answers),
                    datasets: [{
                      data: Object.values(answers),
                      backgroundColor: DEFAULT_COLORS,
                      borderWidth: 1,
                    }]
                  }}
                  options={{
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const value = ctx.raw as number;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${ctx.label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Análisis por grado */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">Desglose por Grado</h2>
        <div className="space-y-10">
        // Sección de Análisis por Grado - Versión Corregida
{Object.entries(data.byGrade).map(([gradeName, gradeData]) => {
  const questionsWithData = Object.entries(gradeData)
    .filter(([_, answers]) => Object.keys(answers).length > 0);

  return (
    <div key={gradeName} className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        {GRADE_NAMES[gradeName] || gradeName}
      </h3>
      
      {questionsWithData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionsWithData.map(([questionKey, answers]) => (
            <div key={questionKey} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-gray-600 mb-2">
                {QUESTION_TEXTS[questionKey as QuestionKey]}
              </h4>
              <div className="h-48">
                <BarChart
                  data={{
                    labels: Object.keys(answers),
                    datasets: [{
                      label: 'Respuestas',
                      data: Object.values(answers),
                      backgroundColor: DEFAULT_COLORS[0],
                    }]
                  }}
                  options={{
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (ctx) => 
                            `${ctx.label}: ${ctx.raw} (${((Number(ctx.raw) / data.total) * 100).toFixed(1)}%)`
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-2 space-y-1">
                {Object.entries(answers).map(([answer, count], idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{answer}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-4">
          No hay respuestas registradas para este grado
        </div>
      )}
    </div>
  );
})}
      </section>

      {/* Insights clave */}
      <section className="bg-indigo-50 p-6 rounded-xl">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Métricas Clave</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Situaciones reportadas"
            value={data.global.P2?.Si || 0}
            total={data.total}
            color="#3498db"
          />
          <StatCard
            title="Resueltos completamente"
            value={data.global.P5?.['Si, se resolvió completamente'] || 0}
            total={data.global.P2?.Si || 1}
            color="#2ecc71"
          />
          <StatCard
            title="Denuncias realizadas"
            value={data.global.P7?.['Sí, denuncié'] || 0}
            total={data.global.P2?.Si || 1}
            color="#e74c3c"
          />
          <StatCard
            title="Ambientes conflictivos"
            value={data.global.P10?.Conflictuado || 0}
            total={data.total}
            color="#f1c40f"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, total, color }: { title: string; value: number; total: number; color: string }) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold" style={{ color }}>
          {value.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {percentage}% del total
        </div>
      </div>
    </div>
  );
}