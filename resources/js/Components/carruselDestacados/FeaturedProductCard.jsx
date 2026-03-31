import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function FeaturedProductCard({ product }) {
    const [isHovered, setIsHovered] = useState(false);

    // Los datos vienen normalizados de tu FeaturedProductResource
    const mainImage = product.main_image;
    const brand = product.brand || "Destilería";
    const category = product.category || "Licor";

    return (
        <Link
            href={`/productos/${product.slug || product.id}`}
            className="group relative flex flex-col h-full bg-white rounded-[2rem] transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-transparent hover:border-gray-100 p-2"
            style={{
              animationDelay: `${product.variant_id * 80}ms`, 
              opacity: 1 
          }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge de Categoría Flotante - Muy minimalista */}
            <div className="absolute top-5 left-5 z-20">
                <span className="bg-white/80 backdrop-blur-md text-[9px] font-black px-3 py-1 uppercase tracking-[0.2em] rounded-full border border-gray-500 text-gray-700">
                    {category}
                </span>
            </div>

            {/* Contenedor de Imagen: Fondo gris muy suave y padding para que la botella respire */}
            <div className="relative aspect-[4/5] bg-[#F9F9F9] rounded-[1.8rem] overflow-hidden flex items-center justify-center p-8">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                
                {/* Sutil gradiente al fondo para dar profundidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Información: Tipografía elegante */}
            <div className="px-4 py-6 text-center">
                <p className="text-[10px] font-bold text-black uppercase tracking-[0.3em] mb-2">
                    {brand}
                </p>
                
                {/* Nombre en Itálica para ese look "Premium" de la foto 3 */}
                <h3 className="text-xl font-black text-darkGray italic leading-tight tracking-tight min-h-[3.5rem] flex items-center justify-center">
                    {product.name}
                </h3>
                
                <div className="mt-4 flex flex-col items-center">
                    <p className="text-2xl font-black text-darkGray">
                        <span className="text-xs mr-1 text-gray-400 font-medium">BOB</span>
                        {parseFloat(product.price).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Botón de acción con el color de tu marca */}
                <div className={`mt-5 flex justify-center transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className="bg-darkGray text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-xl shadow-lg shadow-black/10">
                        Explorar
                    </span>
                </div>
            </div>
        </Link>
    );
}