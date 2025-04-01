'use client';

import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Definir tipos específicos para datos y opciones de gráficos de barras
export const BarChart = ({
  data,
  options,
}: {
  data: ChartData<'bar', number[], unknown>;
  options: ChartOptions<'bar'>;
}) => <Bar options={options} data={data} />;

// Definir tipos específicos para datos y opciones de gráficos de pastel
export const PieChart = ({
  data,
  options,
}: {
  data: ChartData<'pie', number[], unknown>;
  options: ChartOptions<'pie'>;
}) => <Pie options={options} data={data} />;
