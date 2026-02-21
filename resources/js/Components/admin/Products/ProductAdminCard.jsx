import { router } from "@inertiajs/react";
import { useState } from "react";
import { 
    Edit, Trash2, ChevronDown, Package, 
    Layers, CheckCircle2, XCircle, Tag 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddVariantRow from './AddVariantRow';
import DeleteProductModal from './DeleteProductModal';
import DeleteVariantModal from './DeleteVariantModal';

export default function ProductAdminCard({ product, onEdit, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // --- ESTADOS PARA VARIANTES ---
    const [isDelVariantModalOpen, setIsDelVariantModalOpen] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState(null);

    // Calculamos el stock total sumando todas las variantes
    const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;

    // Función que ejecuta la eliminación física en MariaDB
    const handleConfirmVariantDelete = () => {
        if (variantToDelete) {
            router.delete(route('admin.variants.destroy', variantToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDelVariantModalOpen(false);
                    setVariantToDelete(null);
                }
            });
        }
    };

    return (
        <div className="bg-white rounded-[32px] border border-gray-500 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
            {/* Contenido Principal (Maestro) */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                                {product.category?.name || 'General'}
                            </span>
                            {product.alcohol_content && (
                                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                                    {String(product.alcohol_content).replace('.', ',')}% ABV
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button 
                            onClick={() => onEdit(product)}
                            className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                            <Edit size={18} />
                        </button>
                        {/* Botón para eliminar el producto completo */}
                        <button 
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-2 gap-4 mt-6 py-4 border-t border-gray-400">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <Layers size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Presentaciones</p>
                            <p className="text-sm font-bold text-gray-700">{product.variants?.length || 0} Variantes</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${totalStock > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                            <Package size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Stock Total</p>
                            <p className="text-sm font-bold text-gray-700">{totalStock} unidades</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                    {isExpanded ? 'Ocultar detalles' : 'Ver variantes y precios'}
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDown size={14} />
                    </motion.div>
                </button>
            </div>

            {/* Panel de Variantes */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50/50 border-t border-gray-100"
                    >
                        <div className="p-4 space-y-2">
                            {product.variants?.map((variant) => (
                                <div key={variant.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm group/variant">
                                    <div className="flex items-center gap-4">
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-gray-900">{variant.volume || 'S/V'}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">{variant.sku || 'Sin SKU'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-indigo-600">BOB {variant.price}</p>
                                            <p className="text-[10px] font-bold text-green-500">{variant.stock} en stock</p>
                                        </div>

                                        {/* CORRECCIÓN: Botón de eliminar variante */}
                                        <button 
                                            onClick={() => {
                                                setVariantToDelete(variant); 
                                                setIsDelVariantModalOpen(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/variant:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        
                                        <CheckCircle2 size={16} className="text-green-500" />
                                    </div>
                                </div>
                            ))}

                            <button 
                                onClick={() => setIsVariantModalOpen(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                            >
                                + Nueva Presentación
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modales */}
            <AddVariantRow 
                isOpen={isVariantModalOpen} 
                onClose={() => setIsVariantModalOpen(false)} 
                product={product} 
            />

            <DeleteProductModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    onDelete(product.id);
                    setIsDeleteModalOpen(false);
                }}
                productName={product.name}
            />

            <DeleteVariantModal 
                isOpen={isDelVariantModalOpen}
                onClose={() => setIsDelVariantModalOpen(false)}
                onConfirm={handleConfirmVariantDelete}
                variantVolume={variantToDelete?.volume}
            />
        </div>
    );
}