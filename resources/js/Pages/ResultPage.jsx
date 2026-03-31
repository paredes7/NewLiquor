import Layout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/welcome/ProductCard';
import ProductCardMobile from '@/Components/welcome/ProductCardMobile'; // Importamos el nuevo
import SearchBar from '@/Components/search/Search';
import { router } from '@inertiajs/react';

export default function ResultPage({ search, groupedResults }) {
    const categoriesFound = Object.keys(groupedResults);

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
                {categoriesFound.map((catKey) => {
                    let displayTitle = catKey;
                    try {
                        const catData = JSON.parse(catKey);
                        displayTitle = catData.name;
                    } catch (e) {
                        displayTitle = catKey;
                    }

                    return (
                        <div key={catKey} className="mb-16 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                                Productos en "{displayTitle}"
                            </h2>

                            {/* --- CAMBIO AQUÍ: Mantenemos tu grid pero solo para escritorio --- */}
                            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {groupedResults[catKey].map((variant) => (
                                    <ProductCard key={variant.id} product={variant} />
                                ))}
                            </div>

                            {/* --- CAMBIO AQUÍ: Lista vertical optimizada solo para móvil --- */}
                            <div className="flex flex-col md:hidden border border-gray-100 rounded-xl overflow-hidden">
                                {groupedResults[catKey].map((variant) => (
                                    <ProductCardMobile key={variant.id} product={variant} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
}