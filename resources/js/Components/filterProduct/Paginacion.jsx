//COMPONENTE DE PAGINACIÓN
//descripción: Componente de paginación para navegar entre páginas de productos, integrado con Inertia.js para mantener el estado y la URL sincronizados.
import React from "react";

import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Pagination({ links }) {
    // Si solo hay una página, no mostramos nada
    if (links.length <= 3) return null;

    //variantes para animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center items-center gap-1 mt-12 mb-8"
        >
            {links.map((link, key) => {
                // Si no hay URL (puntos suspensivos o flechas deshabilitadas)
                if (link.url === null) {
                    return (
                        <motion.span
                            key={key}
                            variants={itemVariants}
                            className="px-3 py-2 text-gray-400 text-sm"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <motion.div
                        key={key}
                        variants={itemVariants}
                        className="relative"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            key={key} //clave única
                            href={link.url} // Enlace de paginación sirve para navegar
                            preserveScroll // Evita que la página salte al inicio al cambiar
                            only={["products", "totalProducts"]} // Optimiza la carga solo de datos necesarios
                            className={`px-4 py-2 text-sm transition-all duration-200 rounded-sm ${
                                link.active
                                    ? "text-black font-bold"
                                    : "text-gray-500 hover:text-red-600"
                            }`}
                        >
                            <span
                                className="relative z-10"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />

                            {/* Subrayado animado (Layout ID permite que el borde viaje de un número a otro) */}
                            {link.active && (
                                <motion.div
                                    layoutId="activePaginationBorder"
                                    className={`absolute -bottom-1 left-0 right-0 h-[2px]    rounded-full  transition-opacity duration-200
        ${
            link.active
                ? "bg-red-700 opacity-100 shadow-[0_1px_6px_rgba(239,68,68,0.35)]"
                : "opacity-0"
        }`}
                                    initial={{ opacity: 0, scaleX: 0.6 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 220, // más suave
                                        damping: 28, // sin rebote
                                        mass: 0.8, // sensación ligera
                                        opacity: { duration: 0.25 },
                                    }}
                                    style={{ originX: 0.5 }}
                                />
                            )}
                        </Link>
                    </motion.div>
                );
            })}
        </motion.nav>
    );
}
