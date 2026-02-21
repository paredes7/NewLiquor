import React from 'react';
import { Eye } from 'lucide-react';

export default function InventoryTab({ variants, onVariantChange, onImageClick }) {
    return (
        <div className="space-y-4">
            <div className="flex gap-4 px-4 text-[10px] font-black text-gray-400 uppercase">
                <div className="flex-1 text-left">Código (SKU)</div>
                <div className="w-20 text-left">Volumen</div>
                <div className="w-32 text-right">Precio (BOB)</div>
                <div className="w-24 text-center">Stock</div>
                <div className="w-16 text-center">Imagen</div>
            </div>
            {variants.map((v, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    {/* SKU */}
                    <div className="flex-1 p-2 bg-white/50 rounded-lg text-sm text-black text-left font-mono">
                        {v.sku || 'N/A'}
                    </div>
                    
                    {/* Volumen */}
                    <div className="w-20">
                        <input 
                            type="text" 
                            value={v.volume || ''} 
                            onChange={(e) => onVariantChange(index, 'volume', e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border-none text-left text-black font-bold" 
                        />
                    </div>
                    
                    {/* Precio con coma visual */}
                    <div className="w-32">
                        <input 
                            type="text" 
                            value={String(v.price || '').replace('.', ',')} 
                            onChange={(e) => onVariantChange(index, 'price', e.target.value.replace(/[^0-9,]/g, ''))}
                            className="w-full p-2 bg-white rounded-lg border-none text-right text-black font-bold" 
                        />
                    </div>

                    {/* Stock */}
                    <div className="w-24 text-center">
                        <input 
                            type="number" 
                            value={v.stock} 
                            onChange={(e) => onVariantChange(index, 'stock', e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border-none text-center font-bold" 
                        />
                    </div>

                    {/* El Ojo: Llama a la función del padre pasando el índice */}
                    <div className="w-16 flex justify-center">
                        <button 
                            type="button"
                            onClick={() => onImageClick(index)} // <--- Aquí le avisamos al padre el índice
                            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-100"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}