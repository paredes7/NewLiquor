import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "./EventCard";

export default function EventCarousel({ eventos }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // IMPORTANTE: Extraemos el array desde la propiedad 'data' que muestra tu log
    const eventList = eventos?.data || [];

    // Calculamos cuántas "páginas" hay (de 2 en 2)
    const itemsPerPage = 2;
    const totalPages = Math.ceil(eventList.length / itemsPerPage);

    useEffect(() => {
        if (eventList.length <= itemsPerPage) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalPages);
        }, 6000); // Cambio cada 6 segundos

        return () => clearInterval(timer);
    }, [eventList, totalPages]);

    // Si no hay datos, no renderizamos nada para evitar errores
    if (eventList.length === 0) return null;

    // Obtenemos los dos eventos que se mostrarán en la página actual
    const visibleEvents = eventList.slice(
        currentIndex * itemsPerPage,
        currentIndex * itemsPerPage + itemsPerPage,
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="relative w-full overflow-hidden shadow-2xl rounded-2xl mb-10">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    // Clase grid para mostrar 2 columnas en desktop y 1 en móvil
                    className="grid grid-cols-1 md:grid-cols-2 gap-0"
                >
                    {visibleEvents.map((evento) => (
                        <div key={evento.id} className="w-full">
                            <EventCard evento={evento} />
                        </div>
                    ))}

                    {/* Si el número de eventos es impar, mostramos el primero de la lista para rellenar el espacio */}
                    {visibleEvents.length < itemsPerPage &&
                        eventList.length > 0 && (
                            <div className="w-full">
                                <EventCard evento={eventList[0]} />
                            </div>
                        )}
                </motion.div>
            </AnimatePresence>

            {/* Puntos de navegación (Dots) adaptados al número de páginas */}
            {totalPages > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                currentIndex === index
                                    ? "w-8 bg-white"
                                    : "w-2 bg-white/50 hover:bg-white/80"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
        </div> 
    );
}
