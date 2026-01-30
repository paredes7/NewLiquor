import React from "react";
import { Link, router } from "@inertiajs/react";
import { slugify } from "../../utils/slugify";
import { motion } from "framer-motion";

export default function ProductCard({ product, index }) {
    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || product.stock || 0;
    const isOutOfStock = totalStock === 0;
    const mainImage = product.main_image || product.multimedia?.[0]?.url || "https://via.placeholder.com/600x800";

    return (
        <motion.div
            // EFECTO DE CRECIMIENTO: Escalamos a 1.05 al pasar el mouse
            whileHover={{ 
                scale: 1.05,
                zIndex: 30, // Importante: para que flote sobre las otras tarjetas
                transition: { duration: 0.3 } 
            }}
            className="w-full h-full p-2" // Padding extra para que la sombra no se corte
        >
            <Link
                href={`/products/${slugify(product.name)}/${product.id}`}
                // EFECTO DE BRILLO: Usamos shadow-2xl y hover:shadow-red-600/20 si quieres color
                className={`w-full h-full relative overflow-hidden rounded-3xl shadow-xl border bg-white flex flex-col transition-shadow duration-300
                    ${isOutOfStock ? "border-darkTurquoise" : "border-gray-200 hover:border-red-600 hover:shadow-2xl"}
                `}
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                {/* Contenedor de Imagen */}
                <div className="w-full aspect-[4/5] p-4 bg-white border-b border-grayCustom/30 rounded-t-3xl overflow-hidden">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    />
                </div>

                {/* Contenido Textual */}
                <div className="p-4 flex flex-col gap-2 flex-grow bg-white">
                    <span className="text-[11px] uppercase italic tracking-[0.2em]  text-gray-900 font-bold text-center">
                        {product.category || "Categoría"}
                    </span>

                    <h3 className="font-serif italic text-center text-[#a30f0f] text-xl font-bold uppercase tracking-tight leading-tight min-h-[40px] flex items-center justify-center">
                        {product.name}
                    </h3>

                    {/* Disponibilidad / Alcohol */}
                   <p className="text-[11px] text-center italic text-gray-500">
                        {product.content_alcohol
                            ? `Contenido alcohólico: ${product.content_alcohol}` 
                            : "70cl • 40% ABV"}
                    </p>

                    <h2 className="text-[14px] mb-1 font-medium italic text-gray-900 text-center min-h-[40px] flex items-center justify-center overflow-hidden leading-snug px-2">
                        {product.description}
                    </h2>

                    <p className="text-xl italic text-center font-extrabold tracking-wide text-red-700">
                        BOB {Number(product.price).toFixed(2)}
                    </p>

                    {/* Consultar disponibilidad con Línea Animada */}
                    <motion.span
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.visit(
                            `/products/${slugify(product.name)}/${product.id}`,
                        );
                    }}
                    // IMPORTANTE: relative permite que la línea se ubique respecto a este texto
                    className="relative text-red-900 mt-1 mb-1 italic text-center text-[8px] font-serif uppercase tracking-[0.2em] text-gray-700 cursor-pointer select-none"
                    initial="rest"
                    whileHover="hover" // Dispara la variante "hover" en los hijos
                    animate="rest"
                >
                    Consultar disponibilidad
                    {/* Línea animada */}
                    <motion.span
                        variants={{
                            rest: {
                                scaleX: 0,
                                opacity: 0,
                                transition: { duration: 0.3 },
                            },
                            hover: {
                                scaleX: 1,
                                opacity: 1,
                                transition: { duration: 0.3 },
                            },
                        }}
                        className="absolute left-0 -bottom-1 h-[2px] w-full bg-red-600 rounded-full"
                        style={{ originX: 0 }} // La línea crece de izquierda a derecha
                    />
                </motion.span>

                    {/* Botón de Acción */}
                    <div className="mt-auto pt-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isOutOfStock) {
                                    router.post("/cart/add", { product_id: product.id, quantity: 1 });
                                }
                            }}
                            disabled={isOutOfStock}
                            className={`w-full py-2.5 px-4 rounded-full font-bold uppercase text-[10px] tracking-widest transition-all duration-300
                                ${isOutOfStock 
                                    ? "bg-gray-400 text-white cursor-not-allowed" 
                                    : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-red-500/50"
                                }`}
                        >
                            {"Agregar al carrito"}
                        </button>
                    </div>
                </div>

                {/* Badge Agotado */}
                {isOutOfStock && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase z-10">
                        Agotado
                    </div>
                )}
            </Link>
        </motion.div>
    );
}