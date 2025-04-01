import Header from "@/components/Header";
import Questions from "@/components/Questions";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Questions />

          <footer className="mt-8 text-center text-sm text-gray-500">
            <p>Todas las respuestas son anónimas y seguras</p>
            <p>Haz clic en el enlace para ver los resultados de la encuesta:</p>
            <Link
              href="/survey-results"
              className="text-blue-500 hover:underline"
            >
              Ver Resultados de Encuesta
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
