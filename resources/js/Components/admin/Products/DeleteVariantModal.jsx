import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteVariantModal({ isOpen, onClose, onConfirm, variantVolume }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100"
                >
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                            <AlertTriangle size={32} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            ¿Eliminar presentación?
                        </h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                            Vas a borrar la variante de <span className="font-bold text-slate-900">"{variantVolume || 'Sin Volumen'}"</span>. 
                            Esta acción es permanente y afectará al stock total.
                        </p>

                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
                                Cancelar
                            </button>
                            <button 
                                onClick={onConfirm}
                                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={18} /> Eliminar
                            </button>
                        </div>
                    </div>

                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                        <X size={20} />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}