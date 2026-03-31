import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingModal({ show , mensaje}) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-gray-100"
                    >
                        {/* Spinner elegante (puedes usar un GIF o SVG animado aquí) */}
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-turquoise rounded-full animate-spin"></div>
                        
                        <p className="text-sm font-bold uppercase tracking-widest text-darkGray font-poppins">
                            Cargando...
                        </p>
                        <p className="text-xs text-grayCustom -mt-2">
                            {mensaje}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}