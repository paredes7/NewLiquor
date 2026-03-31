import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FilterSelect({ label, options, value, onChange, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="py-3">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left"
            >
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-darkGray">
                    {label}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-3 pt-4 pb-2 pl-2">
                            {/* Opción por defecto (limpiar este filtro) */}
                            <button
                                onClick={() => onChange("")}
                                className={`text-left text-[10px] uppercase tracking-widest transition-all ${!value ? 'text-turquoise font-black' : 'text-gray-400 hover:text-darkGray'}`}
                            >
                                {placeholder}
                            </button>

                            {/* Mapeo de categorías reales de la base de datos */}
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => onChange(option.value)}
                                    className={`text-left text-[10px] uppercase tracking-widest transition-all hover:pl-1 ${value === option.value ? 'text-turquoise font-black' : 'text-gray-500 hover:text-darkGray'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}