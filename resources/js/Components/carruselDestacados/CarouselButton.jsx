//COMPONENTE BOTON CARRUSEL
//descripción: Componente de botón para navegar en un carrusel, con animaciones y estilos personalizados.
import React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CarouselButton({ direction, onClick, disabled }) {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}// Efecto de agrandamiento al pasar el cursor
            whileTap={{ scale: 0.9 }}// Efecto de reducción al hacer clic
            onClick={(e) => {
                e.preventDefault(); // Evita saltos de scroll inesperados
                onClick();
            }}
            disabled={disabled}
            type="button" // Evita comportamientos de submit si está en un form
            className={`absolute z-30 top-1/2 -translate-y-1/2 p-3 bg-white shadow-xl rounded-full border border-gray-100 hover:bg-gray-50 transition-all ${
                direction === "left" ? "-left-1" : "-right-1" // Posicionamiento según dirección
            } ${disabled ? "hidden" : "flex"}`} // Escondemos si está deshabilitado para mejorar estética
        >
            {direction === "left" ? (
                <ChevronLeft className="w-6 h-6 text-gray-700" />
            ) : (
                <ChevronRight className="w-6 h-6 text-gray-700" />
            )}
        </motion.button>
    );
}