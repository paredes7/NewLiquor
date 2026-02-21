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
                {categoriesFound.map((catKey) => {
                    // Intentamos obtener solo el nombre para el título
                    let displayTitle = catKey;
                    try {
                        // Si catKey es un JSON (como se ve en tu imagen), extraemos el 'name'
                        const catData = JSON.parse(catKey);
                        displayTitle = catData.name;
                    } catch (e) {
                        // Si no es JSON, lo dejamos como está
                        displayTitle = catKey;
                    }

                    return (
                        <div key={catKey} className="mb-16 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                                Productos en "{displayTitle}"
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {groupedResults[catKey].map((variant) => (
                                    // Pasamos la variante a tu nuevo ProductCard 
                                    <ProductCard key={variant.id} product={variant} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
}