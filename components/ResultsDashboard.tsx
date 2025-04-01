'use client';

import { useEffect, useState } from 'react';
import { BarChart } from './ChartWrapper';

const colors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
];

type AnalysisAPI = {
  global: Record<string, Record<string, number>>;
  byGrade: Record<string, Record<string, Record<string, number>>>;
  total: number;
};

// Lista de preguntas disponibles (las claves que usa la API: P2 a P11)
const QUESTION_KEYS = ['P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11'];

export default function SurveyResults() {
  const [analysis, setAnalysis] = useState<AnalysisAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('P2');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/results');
        if (!res.ok) throw new Error('Error al obtener datos');
        const data: AnalysisAPI = await res.json();
        setAnalysis(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Cargando datos...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!analysis) {
    return <div className="p-6 text-center">No hay datos disponibles</div>;
  }

  // Extraemos los datos de la pregunta seleccionada.
  const globalQuestionData = analysis.global[selectedQuestion] || {};
  const globalData = {
    labels: Object.keys(globalQuestionData),
    values: Object.values(globalQuestionData),
    totalResponses: analysis.total,
  };

  // Transformamos los datos por grado usando la pregunta seleccionada.
  const gradeData = Object.entries(analysis.byGrade).reduce((acc, [grade, questions]) => {
    const questionData = questions[selectedQuestion] || {};
    const total = Object.values(questionData).reduce((sum, count) => sum + count, 0);
    acc[grade] = {
      labels: Object.keys(questionData),
      values: Object.values(questionData),
      total,
    };
    return acc;
  }, {} as Record<string, { labels: string[]; values: number[]; total: number }>);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Análisis de Encuestas - {new Date().getFullYear()}
      </h1>

      {/* Selector de Pregunta */}
      <div className="mb-8 flex justify-center">
        <select
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-black"
        >
          {QUESTION_KEYS.map((key) => (
            <option key={key} value={key} className='text-black'>
              {key}
            </option>
          ))}
        </select>
      </div>

      {/* Sección Global para la pregunta seleccionada */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Resumen Global ({selectedQuestion})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <BarChart
              data={{
                labels: globalData.labels,
                datasets: [{
                  label: 'Respuestas',
                  data: globalData.values,
                  backgroundColor: colors.slice(0, globalData.labels.length),
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { 
                    display: true,
                    text: `Distribución de Respuestas (${selectedQuestion})`
                  }
                }
              }}
            />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total de encuestas</h3>
              <p className="text-3xl font-bold text-green-600">
                {globalData.totalResponses}
              </p>
            </div>
            {globalData.labels.map((label, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-600">{label}</h4>
                <p className="text-xl font-semibold text-gray-800">
                  {globalData.values[index]} (
                  {(globalData.values[index] / globalData.totalResponses * 100).toFixed(1)}%)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección por Grado para la pregunta seleccionada */}
      {Object.entries(gradeData).map(([grade, data]) => (
        <div key={grade} className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Análisis para {grade} ({selectedQuestion})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <BarChart
                data={{
                  labels: data.labels,
                  datasets: [{
                    label: 'Respuestas',
                    data: data.values,
                    backgroundColor: colors.slice(0, data.labels.length),
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { 
                      display: true,
                      text: `Distribución de Respuestas - ${grade}`
                    }
                  }
                }}
              />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Total en este grado</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {data.total}
                </p>
              </div>
              {data.labels.map((label, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {data.values[index]} ({(data.values[index] / (data.total || 1) * 100).toFixed(1)}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
