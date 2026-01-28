//COMPONENTE PARA EL ENCABEZADO DE LA SECCION DE ANUNCIOS EN LA PAGINA DE EVENTOS

export default function AdHeader({ title, description }) {
    return (
        // Agregamos pt-8 o mt-8 para empujar el texto hacia abajo
        <div className="text-center max-w-4xl mx-auto space-y-2 pt-10">
            <h2 className="text-[#4A1D1D] text-3xl md:text-4xl font-serif font-extrabold uppercase tracking-widest">
                {title}
            </h2>
            <div className="w-24 h-1 bg-[#4A1D1D] mx-auto opacity-20 my-4" />
            <p className="text-gray-700 text-lg font-serif italic leading-relaxed">
                {description}
            </p>
        </div>
    );
}