// resources/js/Components/admin/Products/ProductAdminManager.jsx
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import ProductAdminCard from "./ProductAdminCard";
import EditProductModal from "./EditProductModal";
import AddProductModal from './AddProductModal';


export default function ProductAdminManager({ products = [], categories = [] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id) => {
        router.delete(route('admin.products.destroy', id), {
            onSuccess: () => {},
            preserveScroll: true
        });
    };


    const [searchTerm, setSearchTerm] = useState("");

    // Filtramos por nombre, marca o categoría
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto px-4">
            {/* Barra de Acciones: Igual que en Categorías */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Buscar un producto en particular"
                        className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#0f172a] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                >
                    <Plus size={20} /> Agregar Producto
                </button>
            </div>

            {/* Grid de Productos: Mismo formato de las categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {filteredProducts.map(product => (
                    <ProductAdminCard key={product.id} 
                                        product={product}
                                        onEdit={handleEdit}    
                                        onDelete={handleDelete} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white/40 rounded-[32px] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No se encontraron productos que coincidan con la búsqueda.</p>
                </div>
            )}
            <EditProductModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                product={selectedProduct}
                categories={categories}
            />
            <AddProductModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
        </div>
    );
}