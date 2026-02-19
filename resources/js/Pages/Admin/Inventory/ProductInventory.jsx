import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import ProductAdminCard from '@/Components/admin/Products/ProductAdminCard';

export default function ProductInventory({ products = [], categories = [] }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filtro inteligente: busca por nombre de producto o marca
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        /* Solo pasamos 'title' porque es lo único que MainLayout recibe además de children */
        <MainLayout title="Gestión de Inventario">
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Título de la sección dentro del contenido */}
                    <div className="mb-8">
                        <h2 className="font-semibold text-3xl text-gray-900 leading-tight">
                            Inventario de Productos
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm">Gestiona tus licores, variantes y stock.</p>
                    </div>
                    
                    {/* Barra de Herramientas */}
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Buscar licores o marcas..."
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-[24px] border-none shadow-xl shadow-gray-100 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-[22px] font-bold text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95">
                            <Plus size={18} /> Nuevo Producto
                        </button>
                    </div>

                    {/* Grid Principal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                            <ProductAdminCard key={product.id} product={product} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-32 bg-white rounded-[40px] shadow-sm border border-gray-100">
                            <p className="text-gray-400 font-medium">No se encontraron productos en el inventario.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}