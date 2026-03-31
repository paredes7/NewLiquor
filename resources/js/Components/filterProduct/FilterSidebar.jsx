import React, { useEffect, useState } from "react";
import FilterSelect from "./FilterSelect";
import { router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, X } from "lucide-react";

export default function FilterSidebar({ filtersData = [] }) {
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const MAX_LIMIT = 1500;
    const [priceRange, setPriceRange] = useState(0);

    const getQueryParams = () => {
        if (typeof window === "undefined") return {};
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    };

    const [selectedFilters, setSelectedFilters] = useState(getQueryParams());

    useEffect(() => {
        const params = new URLSearchParams(url.split("?")[1] || "");
        const entries = Object.fromEntries(params.entries());
        setSelectedFilters(entries);
        
        // 2. CORRECCIÓN: Si no hay max_price en la URL, el slider debe volver a 0
        if (entries.max_price) {
            setPriceRange(entries.max_price);
        } else {
            setPriceRange(0); 
        }
    }, [url]);

    const handleFilterChange = (filterLabel, value) => {
        const newFilters = { ...selectedFilters, [filterLabel]: value, page: "1" };
        if (!value) delete newFilters[filterLabel];
        
        // 3. CORRECCIÓN: Si borramos el chip, el slider vuelve a 0 (neutro)
        if (filterLabel === 'max_price' && !value) {
            setPriceRange(0);
        }

        setSelectedFilters(newFilters);
        router.get(window.location.pathname, newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePriceChange = (e) => {
        setPriceRange(e.target.value);
    };

    let priceTimeout; 

    const applyPriceFilter = () => {
        // 1. Cancelamos cualquier temporizador anterior si el usuario sigue moviendo el slider
        if (priceTimeout) clearTimeout(priceTimeout);

        // 2. Programamos la petición para que ocurra 300ms después de que el usuario se detenga
        priceTimeout = setTimeout(() => {
            if (priceRange == 0) {
                handleFilterChange('max_price', "");
            } else {
                // Enviamos la petición definitiva
                handleFilterChange('max_price', priceRange);
            }
        }, 300); // 300ms es un buen equilibrio entre respuesta rápida y debounce
    };

    const handleClearFilters = () => {
        setSelectedFilters({});
        setPriceRange(0); // Reset a neutro
        router.get(window.location.pathname, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const allowedFilters = ["Tamaño", "Tipo", "Marca"];
    const filteredSidebarData = filtersData.filter(f => allowedFilters.includes(f.name));

    return (
        <>
            {/* BOTÓN MÓVIL */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-full mb-6 flex items-center justify-between bg-darkGray text-white px-6 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
            >
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-turquoise" />
                    {Object.keys(selectedFilters).filter(k => k !== 'page').length > 0 
                        ? `Filtros activos (${Object.keys(selectedFilters).filter(k => k !== 'page').length})` 
                        : 'Filtrar Licores'}
                </div>
                <ChevronDown className={`transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} size={16} />
            </button>

            <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 md:pr-8`}>
                
                {/* CHIPS DE FILTROS ACTIVOS */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedFilters).map(([key, val]) => (
                            key !== "page" && (
                                <button
                                    key={key}
                                    onClick={() => handleFilterChange(key, "")}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full text-[9px] font-black uppercase text-darkGray hover:border-turquoise transition-all"
                                >
                                    {key === 'max_price' ? `Hasta BOB ${val}` : val} 
                                    <X size={10} className="text-turquoise" />
                                </button>
                            )
                        ))}
                    </div>
                    {Object.keys(selectedFilters).filter(k => k !== 'page').length > 0 && (
                        <button onClick={handleClearFilters} className="text-[9px] font-black uppercase tracking-widest text-turquoise hover:underline mt-3 block transition-all">
                            BORRAR FILTROS
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    {/* SLIDER DE PRECIO MEJORADO */}
                    <div className="py-4 border-t border-b border-gray-200 mb-2">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-darkGray mb-4">
                            Presupuesto (Máx)
                        </h3>
                        <div className="px-1">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-bold text-gray-700 uppercase">
                                    {priceRange == 0 ? "Filtro Off" : "BOB 0"}
                                </span>
                                <span className={`text-sm font-black px-3 py-1 rounded-lg border transition-all ${priceRange == 0 ? 'text-gray-700 bg-gray-50 border-gray-100' : 'text-turquoise bg-turquoise/5 border-turquoise/20'}`}>
                                    {priceRange == 0 ? "VER TODO" : `BOB ${priceRange}`}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max={MAX_LIMIT} 
                                step="10"
                                value={priceRange}
                                onChange={handlePriceChange}
                                onMouseUp={applyPriceFilter}
                                onTouchEnd={applyPriceFilter}
                                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-all ${priceRange == 0 ? 'bg-gray-200 accent-gray-400' : 'bg-gray-100 accent-turquoise'}`}
                            />
                        </div>
                    </div>

                    {/* SELECTS RESTANTES */}
                    <div className="divide-y divide-gray-700">
                        {filteredSidebarData.map((filter) => (
                            <FilterSelect
                                key={filter.name}
                                label={filter.name}
                                options={filter.values}
                                value={selectedFilters[filter.name] || ""}
                                onChange={(val) => handleFilterChange(filter.name, val)}
                                placeholder={`Cualquier ${filter.name}`}
                            />
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}