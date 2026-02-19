import React from 'react';

export default function GeneralInfoTab({ formData, onChange }) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                    Nombre del Producto
                </label>
                <input 
                    name="name" 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={onChange} 
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900" 
                />
            </div>

            <div className="text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                    Marca
                </label>
                <input 
                    name="brand" 
                    type="text" 
                    value={formData.brand || ''} 
                    onChange={onChange} 
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900" 
                />
            </div>

            <div className="flex flex-col gap-2 text-left">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Graduación Alcohólica
                </label>
                <div className="relative group">
                    <input 
                        name="alcohol_content" 
                        type="text" 
                        value={String(formData.alcohol_content || '').replace('%', '')} 
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            onChange({ target: { name: 'alcohol_content', value: val }});
                        }} 
                        className="w-full p-4 pr-20 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-gray-700" 
                        placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 font-black text-sm pointer-events-none">
                        % ABV
                    </span>
                </div>
            </div>

            <div className="col-span-2 text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                    Descripción del Licor
                </label>
                <textarea 
                    name="description" 
                    value={formData.description || ''} 
                    onChange={onChange} 
                    rows="3" 
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium text-gray-900" 
                />
            </div>
        </div>
    );
}