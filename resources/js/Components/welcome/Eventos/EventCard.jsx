import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function EventCard({ evento }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!evento) return null;

    //limite de caracteres en la descripcion
    const characterLimit = 100;
    const isLongDescription = evento.description?.length > characterLimit;

    //texto a mostrar en la descripcion
    const displayText = isExpanded 
        ? evento.description 
        : `${evento.description?.substring(0, characterLimit)}...`;

    return (
        <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden">
            <img
                src={evento.image}
                alt={evento.title}
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Contenido del evento */}
            <div className="relative h-full flex flex-col justify-end pb-12 px-8 md:px-16 text-white">
                {/* Etiqueta con posición controlada */}
                <div className="mb-2">
                    {evento.label && (
                        <span className="bg-[#b4975a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                            {evento.label}
                        </span>
                    )}
                </div>

                {/* Título del evento */}
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9] mb-4 min-h-[2.4em] flex items-end">
                    {evento.title}
                </h2>

               {/* Descripción con control de expansión */}
                <div className="mb-8 min-h-[4em]">
                    <p className="text-sm md:text-lg text-gray-200 italic opacity-90 inline">
                        {isLongDescription ? displayText : evento.description}
                    </p>
                    
                    {isLongDescription && (
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="ml-2 text-[#b4975a] text-xs font-bold uppercase hover:underline underline-offset-4"
                        >
                            {isExpanded ? 'Cerrar' : 'Leer más'}
                        </button>
                    )}
                </div>

                {/* Botón de acción */}
                <Link
                    href={evento.url}
                    className="w-fit px-10 py-3 border border-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500"
                >
                    Explore now
                </Link>
            </div>
        </div>
    );
}
