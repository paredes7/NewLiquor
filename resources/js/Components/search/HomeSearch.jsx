import { router } from '@inertiajs/react';
import SearchBar from "./Search";

export default function HomeSearch() {
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quita tildes
            .replace(/([^a-z0-9\s])/g, "")   // Quita símbolos (!, @, #, etc.)
            .trim();
    };

    const toSingular = (text) => {
        // Lógica simple para licores: quita la 's' o 'es' al final
        return text
            .replace(/es$/i, "")
            .replace(/s$/i, "");
    };

    const handleSearch = (query) => {
        if (!query) return;

        // 2. Aplicamos la limpieza antes de navegar
        const cleanQuery = normalizeText(query);
        const singularQuery = toSingular(cleanQuery);

        console.log("Navegando con búsqueda optimizada:", singularQuery); 
        
        // Enviamos la versión limpia a Laravel
        router.get('/buscar', { search: singularQuery });
    };

    return (
        <section className="relative w-full bg-[#FFFFBF] py-16 md:py-24 px-6 overflow-hidden">
            <div className="container mx-auto text-center relative z-10">
                {/* Texto Principal */}
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                    Cualquier botella,<br className="hidden md:block" /> 
                    en cualquier lugar.
                </h1>
                
                {/* Subtexto descriptivo */}
                <p className="text-gray-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                    Tu licorería de confianza con entrega inmediata hasta la puerta de tu casa.
                </p>

                {/* Contenedor del Buscador */}
                <div className="max-w-2xl mx-auto">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            {/* Decoración de fondo (opcional para que no se vea tan vacío) */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        </section>
    );
}