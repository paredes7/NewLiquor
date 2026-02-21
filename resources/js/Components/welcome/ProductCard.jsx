import React from "react";
import { router } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function ProductCard({ product: variant }) {
    // 1. Validación de seguridad para evitar el crash inicial
    if (!variant) return null;

    // 2. Lógica Híbrida: Si existe variant.product la usamos (Buscador), 
    // si no, usamos variant directamente (Home/Resources).
    const pData = variant.product || variant;

    // 3. Definición de variables con fallback (soporta ambos formatos)
    const productName = pData.name || "Producto sin nombre";
    const brandName = pData.brand || "Importación Selecta";
    
    // Soporta tanto 'alcohol_content' (DB) como 'content_alcohol' (Resource)
    const alcoholContent = pData.alcohol_content || pData.content_alcohol || "40% ABV";
    
    // Volumen y Precio (normalmente están en la raíz de la variante)
    const displayVolume = variant.volume || "S/V";
    const price = Number(variant.price || 0).toFixed(2);
    const fullName = `${productName} ${displayVolume}`;
    
    // Lógica de Stock
    const isOutOfStock = (variant.stock || 0) <= 0;
    
    // 4. Mapeo de Multimedia (Soporta main_image del Resource o array multimedia)
    const mainImage = variant.main_image 
        || variant.multimedia?.[0]?.url 
        || "https://via.placeholder.com/600x800";
    
    // Categoría: Maneja si es un objeto o un string directo
    const categoryName = (typeof pData.category === 'object' ? pData.category?.name : pData.category) || "Licores";

    return (
        <motion.div
            whileHover={{ 
                scale: 1.02,
                zIndex: 30, 
                transition: { duration: 0.3 } 
            }}
            className="w-full h-full p-2"
        >
            <div
                className={`w-full h-full relative overflow-hidden rounded-3xl shadow-xl border bg-white flex flex-col transition-shadow duration-300
                    ${isOutOfStock ? "border-gray-300 opacity-75" : "border-gray-200"}
                `}
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                {/* Contenedor de Imagen */}
                <div className="w-full aspect-[4/5] p-4 bg-white border-b border-gray-50 rounded-t-3xl overflow-hidden">
                    <img
                        src={mainImage}
                        alt={fullName}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Contenido Textual */}
                <div className="p-4 flex flex-col gap-2 flex-grow bg-white">
                    <span className="text-[10px] uppercase italic tracking-[0.2em] text-gray-400 font-bold text-center">
                        {categoryName}
                    </span>

                    <h3 className="font-serif italic text-center text-[#a30f0f] text-lg font-bold uppercase tracking-tight leading-tight min-h-[50px] flex items-center justify-center">
                        {fullName}
                    </h3>

                    <p className="text-[11px] text-center italic text-gray-500">
                        {displayVolume} • {alcoholContent}
                    </p>

                    <h2 className="text-[13px] mb-1 font-medium italic text-gray-900 text-center min-h-[40px] flex items-center justify-center overflow-hidden leading-snug px-2">
                        {brandName}
                    </h2>

                    <p className="text-xl italic text-center font-extrabold tracking-wide text-red-700">
                        BOB {price}
                    </p>

                    {/* Botón de Acción */}
                    <div className="mt-auto pt-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isOutOfStock) {
                                    router.post("/cart/add", { variant_id: variant.id || variant.featured_variant_id, quantity: 1 });
                                }
                            }}
                            disabled={isOutOfStock}
                            className={`w-full py-2.5 px-4 rounded-full font-bold uppercase text-[10px] tracking-widest transition-all duration-300
                                ${isOutOfStock 
                                    ? "bg-gray-400 text-white cursor-not-allowed" 
                                    : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-red-500/50 active:scale-95"
                                }`}
                        >
                            {isOutOfStock ? "Agotado" : "Agregar al carrito"}
                        </button>
                    </div>
                </div>

                {/* Badge Agotado */}
                {isOutOfStock && (
                    <div className="absolute top-4 right-4 bg-gray-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase z-10">
                        Sin Stock
                    </div>
                )}
            </div>
        </motion.div>
    );
}