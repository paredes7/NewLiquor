import React from "react";
import { router } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function ProductCard({ product: data }) {
    if (!data) return null;

    // --- NORMALIZACIÓN DE DATOS ---
    // Detectamos si es Variante (Search) o Producto (Home)
    const isVariant = !!data.product; 
    const variant = isVariant ? data : (data.variants?.[0] || data);
    const pData = isVariant ? data.product : data;

    // --- EXTRACCIÓN DE DATOS ---
    const productName = pData.name || "Destilado Premium";
    // Buscamos el volumen específicamente en la variante
    const volume = variant.volume || ""; 
    const fullName = `${productName} ${volume}`.trim();
    const brandName = pData.brand || "Bodega Selecta";
    
    // Precio y Stock
    const price = Number(variant.price || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 });
    const isOutOfStock = (variant.stock || 0) <= 0;
    
    // Imagen con lógica de Cloudinary/Storage
    const rawImage = data.main_image || variant.main_image || variant.multimedia?.[0]?.url || pData.multimedia?.[0]?.url;

    const mainImage = rawImage 
        ? (rawImage.startsWith('http') ? rawImage : `/storage/${rawImage}`)
        : "/img/placeholder-bottle.png";

    const categoryName = (typeof pData.category === 'object' ? pData.category?.name : pData.category) || "Licorería";

    const addToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;
        
        router.post(route('carrito.add'), { 
            variant_id: variant.id, 
            quantity: 1 
        }, { preserveScroll: true });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group w-full h-full p-3"
        >
            <div className={`relative flex flex-col h-full bg-white rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl border ${isOutOfStock ? 'grayscale opacity-80' : 'border-gray-100'}`}>
                
                {/* Badge de Categoría Flotante */}
                <div className="absolute top-5 left-5 z-10">
                    <span className="bg-white backdrop-blur-md text-black text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-gray-500">
                        {categoryName}
                    </span>
                </div>

                {/* Contenedor de Imagen (Aspect 4/5 mantenido) */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
                    <motion.img
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        src={mainImage}
                        alt={fullName}
                        className="w-full h-full object-contain drop-shadow-2xl"
                    />
                    
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full uppercase tracking-tighter">
                                Agotado
                            </span>
                        </div>
                    )}
                </div>

                {/* Información del Producto */}
                <div className="p-6 flex flex-col flex-grow text-center gap-1">
                    <p className="text-[10px] text-grayCustom font-poppins uppercase tracking-[3px]">
                        {brandName}
                    </p>
                    
                    {/* Aquí es donde aparece el Nombre + Volumen corregido */}
                    <h3 className="font-playfair text-lg font-bold text-darkGray leading-tight min-h-[3rem] flex items-center justify-center">
                        {fullName}
                    </h3>

                    <div className="flex items-center justify-center gap-2 my-2">
                        <span className="h-[1px] w-8 bg-turquoise/30"></span>
                        <p className="text-[11px] text-turquoise font-bold italic">
                            {pData.alcohol_content || "40"}% Alc.
                        </p>
                        <span className="h-[1px] w-8 bg-turquoise/30"></span>
                    </div>

                    <div className="flex flex-col items-center gap-1 mb-3">
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${
                            variant.stock > 10 ? 'text-green-600' : 'text-orange-500'
                        }`}>
                            {isOutOfStock 
                                ? "Sin existencias" 
                                : `${variant.stock} unidades disponibles`
                            }
                        </p>
                    </div>

                    <div className="mt-auto">
                        <p className="text-2xl font-poppins font-light text-darkGray mb-4">
                            <span className="text-sm font-bold align-top mr-1">BOB</span>
                            {price}
                        </p>

                        <button
                            onClick={addToCart}
                            disabled={isOutOfStock}
                            className={`group/btn relative w-full overflow-hidden py-4 rounded-xl font-poppins text-[10px] font-bold uppercase tracking-[2px] transition-all
                                ${isOutOfStock 
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                    : "bg-darkGray text-white hover:bg-turquoise shadow-lg active:scale-95"
                                }`}
                        >
                            <span className="relative z-10">
                                {isOutOfStock ? "Próximamente" : "Añadir al Carrito"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}