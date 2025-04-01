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
  ArcElement
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

export const BarChart = ({ data, options }: { data: any; options: any }) => (
  <Bar options={options} data={data} />
);

export const PieChart = ({ data, options }: { data: any; options: any }) => (
  <Pie options={options} data={data} />
);