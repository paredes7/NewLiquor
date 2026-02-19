import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { X, Save, Droplet, DollarSign, Database, Image as ImageIcon } from 'lucide-react';

export default function AddVariantModal({ isOpen, onClose, product }) {
    // 1. Estados necesarios para la imagen y el archivo
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null); // Para el visor ImageViewer
    const [selectedFile, setSelectedFile] = useState(null); // El archivo real
    
    const [formData, setFormData] = useState({
        volume: '', // Corregido: 'volume' según tu DB
        price: '',
        stock: '',
    });

    if (!isOpen) return null;

    // 2. Función para capturar y mostrar la imagen
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target.result); // Esto alimenta al visor
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 3. Uso de FormData para enviar el archivo al servidor
        const data = new FormData();
        data.append('product_id', product.id);
        data.append('volume', formData.volume);
        data.append('price', formData.price.replace(',', '.')); // Conversión para DECIMAL
        data.append('stock', formData.stock);
        
        if (selectedFile) {
            data.append('image_file', selectedFile);
        }

        router.post(route('admin.variants.store'), data, {
            onSuccess: () => {
                onClose();
                setFormData({ volume: '', price: '', stock: '' });
                setPreviewImage(null);
                setSelectedFile(null);
            },
            forceFormData: true // Obliga a Inertia a tratarlo como multipart/form-data
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Añadir Variante</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-gray-500 mb-4">Añadiendo para: <span className="font-bold text-indigo-600">{product.name}</span></p>
                    
                    {/* VISOR DE IMAGEN (ImageViewer) */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-40 h-52 bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center relative">
                            {previewImage ? (
                                <img src={previewImage} className="w-full h-full object-cover" alt="Visor" />
                            ) : (
                                <div className="text-gray-400 text-center p-4">
                                    <ImageIcon size={32} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-[10px] font-bold uppercase">Sin Imagen</p>
                                </div>
                            )}
                        </div>
                        
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleFileChange} 
                            accept="image/*" 
                        />
                        
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all"
                        >
                            Seleccionar foto
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Volumen / Tamaño</label>
                        <div className="relative">
                            <Droplet className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                name="volume" 
                                placeholder="Ej: 750ml o 1 Litro" 
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500" 
                                value={formData.volume} 
                                onChange={e => setFormData({...formData, volume: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Precio (BOB)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500" 
                                    value={formData.price} 
                                    onChange={e => {
                                        let val = e.target.value.replace('.', ',');
                                        val = val.replace(/[^0-9,]/g, '');
                                        const parts = val.split(',');
                                        if (parts.length > 2) return;
                                        setFormData({...formData, price: val});
                                    }} 
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                            <div className="relative">
                                <Database className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500" 
                                    value={formData.stock} 
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setFormData({...formData, stock: val});
                                    }} 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-indigo-100">
                        <Save size={20} /> Guardar Variante
                    </button>
                </form>
            </div>
        </div>
    );
}