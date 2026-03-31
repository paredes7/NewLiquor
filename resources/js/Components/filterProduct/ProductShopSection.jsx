import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import FilterSidebar from "@/Components/filterProduct/FilterSidebar";
import ProductCard from "../welcome/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductShopSection({ product, filtersData, totalProducts }) {
    
    const [isFiltering, setIsFiltering] = useState(false);
    const items = product.data || [];
    console.log("--- DEBUG CATÁLOGO no2---");
    console.log("Estructura completa de product:", product);
    console.log("TotalProducts", totalProducts);
    // Si usas paginación de Laravel, los datos están en product.data
    const listaActual = product.data || product;
    console.log("Lista de productos a renderizar:", listaActual);
    
    // Ver nombres para comparar con el backend
    if(Array.isArray(listaActual)) {
        console.table(listaActual.map(p => ({
            id: p.id,
            nombre: p.product?.name || "Sin nombre",
            categoria: p.product?.category?.name || "Sin categoría"
        })));
    }
    console.log("----------------------");
    useEffect(() => {
        // Escuchamos cuando inicia y termina la petición de Inertia
        const start = router.on("start", (event) => {
            if (event.detail.visit.url.pathname === window.location.pathname) {
                setIsFiltering(true);
            }
        });

        const finish = router.on("finish", () => {
            setIsFiltering(false);
        });

        return () => {
            start();
            finish();
        };
    }, []);

    return (
        <section className="bg-[#FFFFBF] py-10 relative">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-10">
                {/* El Sidebar se mantiene siempre visible y clickable */}
                <FilterSidebar filtersData={filtersData} />

                <div className="flex-1 relative">
                    {/* CAPA DE CARGA LOCALIZADA (Como en tu foto 2) */}
                    <AnimatePresence>
                        {isFiltering && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-start pt-20"
                            >
                                <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center gap-4 border border-gray-100">
                                    {/* Spinner circular con tu color turquesa */}
                                    <div className="w-10 h-10 border-4 border-black border-t-turquoise rounded-full animate-spin"></div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-darkGray">Cargando...</p>
                                        <p className="text-[10px] text-black mt-1">Buscando productos</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CUADRÍCULA DE PRODUCTOS */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300 ${isFiltering ? 'grayscale-[0.5] opacity-50' : ''}`}>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <ProductCard 
                                    /* CAMBIO AQUÍ: 
                                    Si tu objeto tiene 'variant_id', úsalo. 
                                    Si no, usa 'item.id' pero asegúrate de que el Backend 
                                    esté mandando el ID de la variante en ese campo.
                                    */
                                    key={item.variant_id || item.id} 
                                    product={item} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-black font-bold uppercase text-xs tracking-widest">
                                No se encontraron botellas con esos filtros
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}