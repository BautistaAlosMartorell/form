import Image from "next/image";

const Header = () => {
  return (
    <header className="bg-[#C8F2C2] shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
        <Image
          src="/logopio.png"
          alt="Logotipo del Instituto Comercial Pío X"
          width={120} 
          height={120} 
          className="transition-transform transform hover:scale-107" 
        />
        <h1 className="text-4xl font-bold text-gray-800 text-center mt-4">
          ENCUESTA INSTITUCIONAL - INSTITUTO COMERCIAL PÍO X
        </h1>
        <p className="text-gray-600 text-center mt-2 text-xl">
        Encuesta para alumnos del Instituto Comercial Pío X de Tunuyán, Mendoza.
        Te pedimos que completes este formulario en forma individual y seas sincero/a con tus respuestas. ¡Gracias!
        </p>
      </div>
    </header>
  );
};

export default Header;
