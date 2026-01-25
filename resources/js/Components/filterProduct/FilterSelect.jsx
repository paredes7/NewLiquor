import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FilterSelect Profesional
 * @param {string} label - Título del filtro (ej: "Tamaño")
 * @param {Array} options - [{label: '750ml', value: '750'}]
 * @param {string} value - Valor actualmente seleccionado
 * @param {function} onChange - Función para actualizar el filtro
 * @param {string} placeholder - Texto cuando no hay nada seleccionado
 */
export default function FilterSelect({
    label,
    options = [],
    value = "",
    onChange,
    placeholder = "Seleccionar...",
    defaultOpen = false,
    badge = null,
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleOptionClick = (optionValue) => {
        if (value === optionValue) {
            onChange(""); // Deseleccionar si ya está seleccionado
        } else {
            onChange(optionValue);
        }
    };
    // Determina si hay un filtro activo para resaltar el encabezado
    const isActive = value !== "";

    return (
        <div className="py-4 border-b border-gray-100 last:border-0">
            {/* ENCABEZADO / BOTÓN DE CONTROL */}
            <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between group transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <motion.span
                        animate={{
                            scale: isOpen || isActive ? "#000" : "#9ca3af",
                        }}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                            isOpen || isActive
                                ? "text-black"
                                : "text-gray-400 group-hover:text-gray-600"
                        }`}
                    >
                        {label}
                    </motion.span>

                    {/* 2. EL PUNTO DORADO: Se muestra solo si isActive es true */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="w-2 h-2 rounded-full bg-red-600" // Color dorado (Gold)
                                title="Filtro activo"
                            />
                        )}
                    </AnimatePresence>
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <ChevronDown
                        size={16}
                        className={`transition-colors ${isOpen ? "text-black" : "text-gray-300"}`}
                    />
                </motion.div>
            </button>

            {/* LISTA DE VALORES DIRECTA */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                    >
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-1">
                                {/* Mapeo de opciones reales */}
                                {options.map((option, index) => (
                                    <motion.button
                                        key={`${label}-${option.value}-${index}`} //clave única
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.03 }}
                                        onClick={() =>
                                            handleOptionClick(option.value)
                                        } //maneja selección
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center justify-between px-3 py-2 text-[11px] rounded-sm transition-colors ${
                                            value === option.value
                                                ? "bg-red-50 text-red-600 font-bold"
                                                : "text-gray-500 hover:bg-gray-100 hover:text-red-400"
                                        }`} //estilos condicionales
                                    >
                                        <span className="uppercase tracking-wider">
                                            {option.label}
                                        </span>
                                        {value === option.value && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                            >
                                                <Check
                                                    size={12}
                                                    strokeWidth={3}
                                                />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
