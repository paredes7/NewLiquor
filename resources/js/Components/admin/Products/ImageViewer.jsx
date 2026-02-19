import React from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';

export default function ImageViewer({ isOpen, src, onClose, onFileSelect }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
            <div className="bg-white rounded-[40px] p-8 max-w-md w-full flex flex-col items-center">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Imagen de la Variante</h3>
                
                {/* Previsualización circular o cuadrada suave */}
                <div className="w-64 h-64 bg-gray-50 rounded-[32px] overflow-hidden border-4 border-gray-100 mb-8">
                    <img src={src || '/images/placeholder.png'} className="w-full h-full object-contain" />
                </div>

                {/* Única acción: Subir desde dispositivo */}
                <button 
                    onClick={onFileSelect}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
                >
                    <Upload size={20} /> Seleccionar nueva foto
                </button>

                <button onClick={onClose} className="mt-4 text-gray-400 font-bold hover:text-gray-600">Cerrar</button>
            </div>
        </div>
    );
}