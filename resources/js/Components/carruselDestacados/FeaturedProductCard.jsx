//COMPONENTE TARJETA DE PRODUCTO DESTACADO
//descripción: Componente de tarjeta para mostrar productos destacados con animaciones y efectos visuales atractivos.
import React from 'react';

import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function FeaturedProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  // Obtenemos la primera imagen o un placeholder
  const mainImage = product.main_image || `https://via.placeholder.com/480x640?text=${product.name}`;

  return (
    <Link
      href={`/products/${product.slug}/${product.id}`}
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-500 hover:shadow-xl hover:border-gray-300 flex flex-col h-full"
      style={{
        animationDelay: `${product.id * 80}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Etiqueta Flotante (Label del FeaturedProduct) */}
      {product.label && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-black text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded-sm shadow-lg">
            {product.label}
          </span>
        </div>
      )}

      {/* Contenedor de Imagen con Efectos */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradiente al hacer Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Efecto Shine (Brillo) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shine" />
        </div>
      </div>

      {/* Información del Producto */}
      <div className="relative px-4 py-5 text-center flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-black tracking-tight leading-tight uppercase min-h-[40px] flex items-center justify-center">
          {product.name}
        </h3>

        <h2 className="text-sm text-gray-400 tracking-tight leading-none uppercase min-h-[20px] flex items-center justify-center">
          {product.description}
        </h2>
        
        <p className="mt-2 text-lg font-black text-red-700 flex-grow flex items-center justify-center">
          BOB {parseFloat(product.price).toFixed(2)}
        </p>

        {/* Botón dinámico (Ver modelos / Añadir) */}
        <div
          className={`mt-4 flex justify-center items-center gap-2 text-xs font-black uppercase tracking-widest text-black transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="border-b-2 border-black">Ver detalles</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}