import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Info, Package } from 'lucide-react';
import GeneralInfoTab from './GeneralInfoTab';
import InventoryTab from './InventoryTab';
import ImageViewer from './ImageViewer';
import { router } from '@inertiajs/react';

export default function ProductEditModal({ isOpen, onClose, product }) {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('general');
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);

    const handleUrlChange = (url) => {
        const newVariants = [...formData.variants];
        // Guardamos la URL en el estado para previsualizar y para el envío
        newVariants[uploadingVariantIndex].preview = url;
        newVariants[uploadingVariantIndex].image_url = url; 
        setFormData({ ...formData, variants: newVariants });
        setPreviewImage(url); // Actualiza el visor en tiempo real
    };

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        brand: '',
        category_id: '',
        alcohol_content: '',
        description: '',
        variants: []
    });

    useEffect(() => {
        if (product) {
            setFormData({ ...product, variants: product.variants || [] });
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Image = event.target.result;

            // 1. Actualizamos el estado global de variantes para el envío final
            const newVariants = [...formData.variants];
            newVariants[uploadingVariantIndex].preview = base64Image;
            newVariants[uploadingVariantIndex].newFile = file; 
            setFormData({ ...formData, variants: newVariants });

            // 2. ¡CLAVE! Actualizamos el visor para que la imagen cambie YA
            setPreviewImage(base64Image); 
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        // 1. Validación básica de ingeniería
        if (!formData.name?.trim()) return alert("El nombre es obligatorio");

        // 2. Creamos el contenedor FormData para soportar archivos
        const data = new FormData();
        
        // 3. Spoofing de método: Enviamos POST pero Laravel lo lee como PUT
        data.append('_method', 'PUT');
        
        // 4. Agregamos datos del producto padre
        data.append('id', formData.id);
        data.append('name', formData.name);
        data.append('brand', formData.brand);
        data.append('category_id', formData.category_id);
        data.append('alcohol_content', formData.alcohol_content);
        data.append('description', formData.description || '');

        // 5. Agregamos las variantes y sus archivos nuevos
        formData.variants.forEach((v, index) => {
            data.append(`variants[${index}][id]`, v.id);
            data.append(`variants[${index}][sku]`, v.sku);
            // Convertimos coma a punto para la base de datos DECIMAL
            data.append(`variants[${index}][price]`, String(v.price).replace(',', '.'));
            data.append(`variants[${index}][stock]`, v.stock);
            
            // Si el usuario seleccionó una foto nueva para esta variante, la adjuntamos
            if (v.newFile) {
                data.append(`variants[${index}][newFile]`, v.newFile);
            }
        });

        // 6. Enviamos usando router.post (con el _method PUT adentro)
        router.post(route('admin.products.update', formData.id), data, {
            onSuccess: () => {
                onClose();
            },
            onError: (errors) => {
                console.error("Errores del servidor:", errors);
            },
            forceFormData: true, // Asegura que Inertia use el formato correcto para archivos
            preserveScroll: true
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 text-left">Editar Licor</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
                </div>

                <div className="flex px-6 border-b border-gray-100 bg-gray-50/50">
                    <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}><Info size={18} /> Información General</button>
                    <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all ${activeTab === 'inventory' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}><Package size={18} /> Inventario y Variantes</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'general' ? (
                        <GeneralInfoTab formData={formData} onChange={handleInputChange} />
                    ) : (
                        <InventoryTab 
                            variants={formData.variants} 
                            onVariantChange={handleVariantChange}
                            onImageClick={(index) => {
                                setUploadingVariantIndex(index); // 1. Guardamos el índice localmente
                                
                                // 2. Buscamos la imagen para mostrar en el visor
                                const currentImg = formData.variants[index].preview || formData.variants[index].multimedia?.[0]?.url;
                                setPreviewImage(currentImg);
                                
                                // 3. Abrimos el visor
                                setShowImageViewer(true);
                            }}
                        />
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                    <button onClick={onClose} className="px-8 py-3 text-gray-500 font-bold">Cancelar</button>
                    <button 
                        onClick={handleSubmit} // <--- ESTA ES LA CONEXIÓN CLAVE
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                    >
                        <Save size={18} /> Guardar Cambios
                    </button>
                </div>
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <ImageViewer 
                isOpen={showImageViewer} 
                src={previewImage} 
                onClose={() => setShowImageViewer(false)} 
                /* Esta es la clave: le pasamos el disparador al hijo */
                onFileSelect={() => fileInputRef.current.click()} 
            />
        </div>
    );
}