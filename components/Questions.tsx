'use client';

import { useState, useEffect } from 'react';
import Confetti from 'react-dom-confetti';

const Questions = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const questions = [
    {
      id: 1,
      question:
        "¿En qué grado estás",
      options: [
        "Primer grado",
        "Segundo grado",
        "Tercer grado",
        "Cuarto grado",
        "Quinto grado",
        "Sexto grado",
        "Séptimo grado",
        
      ],
    },
    {
      id: 2,
      question:
        "¿Has visto o vivido alguna vez algo que te hizo sentir mal en la escuela? (Por ejemplo, que te molesten o te traten mal)",
      options: ["Si", "No"],
    },
    {
      id: 3,
      question: "¿Qué fue lo que ocurrió?",
      options: [
        "Burlas",
        "Apodos ofensivos",
        "Exclusión o no dejar participar a alguien",
        "Empujones, golpes u otras agresiones físicas",
        "Mensajes o comentarios hirientes en redes sociales",
        "Otro",
      ],
      dependsOn: 2,
      showIf: "Si",
    },
    {
      id: 4,
      question: "¿Cuántas veces durante el año pasaron estas situaciones?",
      options: ["1 vez", "2 veces", "3 veces", "4 veces", "5 o más veces"],
      dependsOn: 2,
      showIf: "Si",
    },
    {
      id: 5,
      question: "¿Se logró solucionar?",
      options: [
        "Si, se resolvió completamente",
        "Si, pero volvió a suceder",
        "No, sigue ocurriendo",
        "No lo sé",
      ],
      dependsOn: 2,
      showIf: "Si",
    },
    {
      id: 6,
      question: "¿Quién ayudó a solucionar la situación?",
      options: [
        "Un maestro o directivo",
        "Un compañero",
        "Un familiar",
        "Nadie intervino",
        "Otro",
      ],
      dependsOn: 5,
      showIf: "Si, se resolvió completamente",
    },
    {
      id: 7,
      question:
        "¿Le contaste a algún adulto lo que pasó?",
      options: [
        "Sí, denuncié",
        "No, pero lo consideré",
        "No, porque no me sentí seguro",
      ],
      dependsOn: 2,
      showIf: "Si",
    },
    {
      id: 8,
      question:
        "Si le contaste a un adulto, ¿Cómo reaccionaron? (Por ejemplo, ¿te ayudaron, te escucharon?)",
      options: [
        "Muy efectiva",
        "Efectiva",
        "Poco efectiva",
        "No hubo respuesta",
      ],
      dependsOn: 7,
      showIf: "Sí, denuncié",
    },
    {
      id: 9,
      question:
        "¿Qué emociones experimentaste durante o después de la situación?",
      options: ["Tristeza", "Miedo", "Enojo", "Indiferencia", "Otra"],
      dependsOn: 2,
      showIf: "Si",
    },
    {
      id: 10,
      question:
        "¿Cómo describirías el ambiente general en tu escuela en relación con el respeto entre compañeros?",
      options: ["Muy respetuoso", "Respetuoso", "Poco respetuoso", "Conflictuado"],
      dependsOn: 2,
      showIf: "Si",
    },
    {
      id: 11,
      question:
        "¿Qué medidas te gustaría que se implementaran para mejorar el ambiente escolar y prevenir futuros incidentes?",
      options: [
        "Charlas de sensibilización",
        "Talleres de convivencia",
        "Mayor presencia de docentes",
        "Apoyo psicológico",
        "Otra",
      ],
      dependsOn: 2,
      showIf: "Si",
    },
  ];

  // Permite pasar respuestas actualizadas para verificar dependencias
  const shouldShowQuestion = (questionIndex: number, currentAnswers = answers) => {
    const question = questions[questionIndex];
    if (!question.dependsOn) return true;

    const dependentAnswer = currentAnswers[question.dependsOn];
    return dependentAnswer?.includes(question.showIf);
  };

  const handleAnswer = (answer: string) => {
    const currentQuestionId = questions[currentStep].id;
    const newAnswers = { ...answers, [currentQuestionId]: answer };
    setAnswers(newAnswers);

    // Si responde No a la primera pregunta, finaliza el formulario inmediatamente
    if (currentStep === 0 && answer === "No") {
      setIsSubmitted(true);
      return;
    }

    // Calcular siguiente pregunta válida usando las respuestas actualizadas
    let nextStep = currentStep + 1;
    while (nextStep < questions.length && !shouldShowQuestion(nextStep, newAnswers)) {
      nextStep++;
    }

    if (nextStep < questions.length) {
      setCurrentStep(nextStep);
    } else {
      setIsSubmitted(true);
    }
  };

  // Cuando se envía el formulario, activar el confetti después de un pequeño retardo
  useEffect(() => {
    const submitForm = async () => {
      if (isSubmitted) {
        try {
          // Crear nueva encuesta
          const newSurvey = await fetch('/api/surveys', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Añadir headers
            },
            body: JSON.stringify({
              grade: answers[1],
              responses: Object.entries(answers).map(([questionId, answer]) => ({
                questionId: parseInt(questionId),
                answer
              }))
            })
          });
    
          if (newSurvey.ok) {
            setShowConfetti(true);
            console.log('Respuestas guardadas exitosamente');
          }
        } catch (error) {
          console.error('Error al guardar las respuestas:', error);
        }
      }
    };

    submitForm();
  }, [isSubmitted]);


  const confettiConfig = {
    angle: 120,
    spread: 360,
    startVelocity: 15,
    elementCount: 80,
    dragFriction: 0.10,
    duration: 1000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  if (isSubmitted) {
    return (
      <div
        className="max-w-full mx-auto px-4 py-8 text-center relative"
        style={{ minHeight: "300px" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Confetti active={showConfetti} config={confettiConfig} />
        </div>
        <h2 className="text-2xl font-semibold text-[#49A646] mb-4">
          ¡Gracias por participar!
        </h2>
        <p className="text-gray-600">
          Tus respuestas han sido guardadas de forma anónima.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div
          className="h-2 bg-gray-200 rounded-full transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / questions.length) * 100}%`,
            backgroundColor: "#49A646",
          }}
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800">
          {questions[currentStep].question}
        </h3>

        <div className="space-y-3 text-gray-600">
          {questions[currentStep].options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-[#e8ffe4] hover:border-[#49a646ce] transition-colors hover:scale-101 hover:shadow-lg "
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
