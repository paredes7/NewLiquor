import React from "react";
import { router } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function ProductCardMobile({ product: data }) {
    if (!data) return null;

    // --- Lógica de Normalización de datos ---
    const isVariant = !!data.product; 
    const variant = isVariant ? data : (data.variants?.[0] || data);
    const pData = isVariant ? data.product : data;

    const productName = pData.name || "Destilado";
    const volume = variant.volume || "";
    const fullName = `${productName} ${volume}`.trim();
    const price = Number(variant.price || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 });
    const isOutOfStock = (variant.stock || 0) <= 0;
    
    const rawImage = variant.main_image || variant.multimedia?.[0]?.url || pData.multimedia?.[0]?.url;
    const mainImage = rawImage 
        ? (rawImage.startsWith('http') ? rawImage : `/storage/${rawImage}`)
        : "/img/placeholder-bottle.png";

    const addToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;
        router.post(route('carrito.add'), { variant_id: variant.id, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`relative flex items-center w-full bg-white border-b border-gray-100 p-4 gap-4 ${isOutOfStock ? 'opacity-60' : ''}`}
        >
            {/* 1. Imagen a la izquierda (Compacta) */}
            <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden p-2">
                <img 
                    src={mainImage} 
                    alt={fullName} 
                    className="w-full h-full object-contain drop-shadow-md"
                />
            </div>

            {/* 2. Información al centro/derecha */}
            <div className="flex-grow flex flex-col justify-between min-h-[80px]">
                <div>
                    <p className="text-[9px] uppercase tracking-widest text-turquoise font-bold">
                        {pData.brand || "Premium"}
                    </p>
                    <h3 className="font-playfair text-sm font-bold text-darkGray leading-tight line-clamp-2">
                        {fullName}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-1">
                    <p className="text-lg font-poppins font-bold text-red-700">
                        <span className="text-[10px] mr-1">BOB</span>
                        {price}
                    </p>
                    
                    {/* Botón de acción pequeño */}
                    <button
                        onClick={addToCart}
                        disabled={isOutOfStock}
                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter transition-all
                            ${isOutOfStock 
                                ? "bg-gray-200 text-gray-400" 
                                : "bg-darkGray text-white active:scale-95 shadow-sm"
                            }`}
                    >
                        {isOutOfStock ? "Agotado" : "Añadir"}
                    </button>
                </div>
            </div>

            {/* Badge de porcentaje de alcohol pequeño */}
            <div className="absolute top-2 right-4">
                <span className="text-[8px] text-gray-400 italic">
                    {pData.alcohol_content || "40"}% Alc.
                </span>
            </div>
        </motion.div>
    );
}