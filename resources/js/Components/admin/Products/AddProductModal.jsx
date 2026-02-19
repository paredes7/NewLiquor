import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { X, Save, Package, Tag, FileText, Droplets } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose }) {
    const { categories } = usePage().props; // Traemos las categorías del backend

    // Estado inicial minimalista según tu arquitectura
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        brand: '',
        alcohol_content: '',
        description: '',
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica antes de enviar
        if (!formData.name || !formData.category_id) {
            alert("El nombre y la categoría son obligatorios");
            return;
        }

        router.post(route('admin.products.store'), formData, {
            onSuccess: () => {
                onClose();
                setFormData({ // Limpiamos el formulario
                    name: '',
                    category_id: '',
                    brand: '',
                    alcohol_content: '',
                    description: '',
                });
            },
            preserveScroll: true
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Cabecera */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                            <Package size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Nuevo Producto</h2>
                            <p className="text-sm text-gray-500">Registra la información base del licor</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre del Producto */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre del Producto</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Johnnie Walker Black Label"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Categoría</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Marca */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Marca</label>
                            <input
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Ej: Diageo"
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                required
                            />
                        </div>

                        {/* Graduación Alcohólica */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Graduación (% ABV)</label>
                            <div className="relative">
                                <Droplets className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="alcohol_content"
                                    value={formData.alcohol_content}
                                    onChange={(e) => {
                                        let val = e.target.value.replace('.', ',');
                                        
                                        val = val.replace(/[^0-9,]/g, '');
                                        const commaCount = (val.match(/,/g) || []).length;
                                        if (commaCount > 1) return;

                                        setFormData(prev => ({ ...prev, alcohol_content: val }));
                                    }}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Descripción Corta */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Descripción</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Breve descripción del licor..."
                                    rows="3"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={20} /> Crear Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}