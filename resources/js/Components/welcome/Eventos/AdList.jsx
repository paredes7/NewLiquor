//COMPONENTE CONTENEDOR
//descripción: Componente que renderiza una lista de secciones de anuncios en la página de eventos.

import AdSection from "./AdSection";

export default function AdList({ anuncios = [] }) {
    // Si no hay anuncios, evitamos renderizar el contenedor
    if (!anuncios || anuncios.length === 0)
        return (
            <h2 className="text-2xl mb-3 mt-3 font-medium text-center tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-red-950 to-red-400">
                No hay anuncios disponibles
            </h2>
        );

    return (
        <div className="bg-[#fdc2a0]">
            {anuncios.map((anuncio, index) => (
                <AdSection
                    key={`event-ad-${anuncio.id || index}`}
                    title={anuncio.title}
                    description={anuncio.description}
                    product={anuncio.productos || []}
                />
            ))}
        </div>
    );
}
