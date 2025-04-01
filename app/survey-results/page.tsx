'use client';

import { useState } from 'react';
import ResultsDashboard from '@/components/ResultsDashboard';

export default function DashboardPage() {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === correctPassword) {
      setAuthorized(true);
    } else {
      alert('⚠️ Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800">🔒 Acceso Restringido</h1>
          <p className="text-gray-600 mt-2">Solo los profesores pueden ver los resultados.</p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa la contraseña"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold rounded-lg py-2 transition-transform transform hover:scale-105"
            >
              🔑 Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ResultsDashboard />
    </div>
  );
}
