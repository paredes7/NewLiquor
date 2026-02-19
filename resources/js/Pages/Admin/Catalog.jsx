import { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
// Importamos el componente de gestión que crearemos a continuación
import CategoryManager from "@/Components/admin/Categorias/CategoryManager.jsx";
import ProductAdminManager from "@/Components/admin/Products/ProductAdminManager";

export default function Catalog({ categories = [], products = [] }) {
    const [activeTab, setActiveTab] = useState("categories");

    return (
        <div className="min-h-screen bg-[#FDFDFF] flex flex-col font-sans selection:bg-indigo-100">
            <Head title="Catalog Management" />
            <AdminHeader />

            <main className="container mx-auto py-10 px-6">
                
                {/* 1. Switch de Navegación Estilizado */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        <button
                            onClick={() => setActiveTab("categories")}
                            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === "categories" 
                                ? "bg-gray-900 text-white shadow-lg shadow-gray-200" 
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            Categories
                        </button>
                        <button
                            onClick={() => setActiveTab("products")}
                            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === "products" 
                                ? "bg-gray-900 text-white shadow-lg shadow-gray-200" 
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            Products
                        </button>
                    </div>
                </div>

                {/* 2. Renderizado de Contenido */}
                {activeTab === "categories" ? (
                    <CategoryManager categories={categories} />
                ) : (
                    /* Solo dejamos el Manager real, eliminando el div del cohete */
                    <div className="mt-8">
                        <ProductAdminManager products={products} categories={categories} />
                    </div>
                )}
            </main>
        </div>
    );
}