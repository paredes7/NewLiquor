import Layout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/welcome/ProductCard';
import SearchBar from '@/Components/search/Search'; // Importamos tu componente Search
import { router } from '@inertiajs/react';

export default function ResultPage({ search, groupedResults }) {
    // Convertimos el objeto agrupado en un array para mapear
    const categoriesFound = Object.keys(groupedResults);

    // Lógica para manejar la búsqueda desde esta misma página
    const handleSearch = (query) => {
        router.get('/buscar', { search: query });
    };

    return (
        <Layout title={`Resultados para: ${search}`}>
            <div className="container mx-auto py-12 px-6 min-h-screen">
                
                {/* --- SECCIÓN DE LA BARRA DE BÚSQUEDA --- */}
                <div className="max-w-2xl mx-auto mb-16">
                    <p className="text-center text-gray-400 text-xs uppercase tracking-widest mb-4 font-bold">
                        ¿Quieres buscar otra botella?
                    </p>
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* --- TÍTULO DE RESULTADOS --- */}
                <h1 className="text-3xl font-black text-gray-900 uppercase mb-12 border-b pb-4">
                    Resultados para: <span className="text-orange-600">"{search}"</span>
                </h1>

                {/* --- LISTADO POR CATEGORÍAS --- */}
                {categoriesFound.length > 0 ? (
                    categoriesFound.map((catName) => (
                        <div key={catName} className="mb-16 animate-fade-in">
                            {/* Título de la Categoría o Subcategoría encontrada */}
                            <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                                Productos en "{catName}"
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {groupedResults[catName].map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-xl font-medium">
                            No hay coincidencias para "{search}". 🍾
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}