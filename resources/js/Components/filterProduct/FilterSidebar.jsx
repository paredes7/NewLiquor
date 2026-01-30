//COMPONENTE BARRA LATERAL DE FILTROS
//descripción: Componente de barra lateral para aplicar filtros en la página de productos, sincronizado con la URL y Laravel mediante Inertia.js.
import React, { useEffect, useState } from "react";
import FilterSelect from "./FilterSelect";
import { router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterSidebar({ filtersData = [] }) {
    const { url } = usePage();
    // 1. Función para obtener filtros de la URL de forma segura
    const getQueryParams = () => {
        if (typeof window === "undefined") return {};
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    };

    // 2. Estado local sincronizado con la URL
    const [selectedFilters, setSelectedFilters] = useState(getQueryParams());

    // Sincronizar el estado si la URL cambia (por ejemplo, al darle atrás en el navegador)
    useEffect(() => {
        const params = new URLSearchParams(url.split("?")[1] || "");
        setSelectedFilters(Object.fromEntries(params.entries()));
    }, [url]);

    const handleFilterChange = (filterLabel, value) => {
        // Creamos el nuevo objeto de filtros
        const newFilters = {
            ...selectedFilters,
            [filterLabel]: value,
            page: "1", // Reiniciamos a la primera página al cambiar un filtro
        };

        // Si el valor es vacío, eliminamos la propiedad para limpiar la URL
        if (!value) delete newFilters[filterLabel];

        // Actualizamos estado local para respuesta instantánea
        setSelectedFilters(newFilters);

        // 3. Petición a Laravel mediante Inertia
        router.get("/", newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    if (!Array.isArray(filtersData)) return null;

    //para que no recarge toda la pagina al oprimir limpiar filtros
    const handleClearFilters = () => {
        setSelectedFilters({});
        router.get(
            "/",
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ["product", "filtersData", "totalProducts"],
            },
        );
    };

    //variantes para animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Los hijos aparecen uno tras otro
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <aside className="w-full md:w-64 flex-shrink-0 pr-8">
         
            {/* Contenedor Flex para alinear Título y Botón */}
            <div className="mb-2">
                

                <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedFilters).map(
                        ([key, val]) =>
                            key !== "page" && (
                                <button
                                    key={key}
                                    onClick={() => handleFilterChange(key, "")}
                                    className="flex items-center gap-2 px-3 py-1 bg-[#f5f1e8] border border-[#d4c5a1] rounded-full text-[10px] font-bold uppercase text-[#8b7a5e] hover:bg-[#ede5d1] transition-colors"
                                >
                                    {val} <span className="text-xs">×</span>
                                </button>
                            ),
                    )}
                </div>

                {/* Botón alineado a la derecha */}
                <AnimatePresence>
                    {Object.keys(selectedFilters).length > 0 && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClearFilters}
                            className="text-[10px] font-bold uppercase tracking-wider text-turquoise bg-turquoise/5 px-2 py-1 rounded-sm hover:bg-turquoise hover:text-white transition-colors duration-300"
                        >
                            borrar todos los filtros
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-0 border-t border-gray-100 pt-0"
            >
                {/* Filtros dinámicos de Laravel */}
                {filtersData.length > 0 ? (
                    filtersData.map((filter) => (
                        <motion.div
                            key={filter.name}
                            variants={itemVariants}
                            className="border-b border-gray-50 last:border-0"
                        >
                            <FilterSelect
                                key={filter.name}
                                label={filter.name}
                                options={filter.values}
                                value={selectedFilters[filter.name] || ""}
                                onChange={(val) =>
                                    handleFilterChange(filter.name, val)
                                }
                                placeholder={`Selecciona ${filter.name}`}
                            />
                        </motion.div>
                    ))
                ) : (
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-400 text-sm py-4 italic"
                    >
                        No hay filtros disponibles
                    </motion.p>
                )}
            </motion.div>
        </aside>
    );
}
