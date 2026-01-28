//COMPONENTE PRINCIPAL
//PARA MOSTRAR LA SECCION DE PRODUCTOS CON FILTROS
//descripción: Componente principal para mostrar la sección de productos con filtros aplicables en la página de tienda.
import FilterSidebar from "@/Components/filterProduct/FilterSidebar";
import ProductCard from "@/Components/welcome/ProductCard";
import Pagination from "./Paginacion";
import AnuncioProductCard from "../welcome/ProductCard";

export default function ProductShopSection({
    product,
    filtersData,
    totalProducts,
}) {
    const items = product?.data || [];
   const paginationLinks = product?.meta?.links || product?.links || [];
    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 1. NUEVO TITULO (BREADCRUMBS) */}
                <div className="mb-4">
                    <h3 className="text-[16px] font-bold uppercase tracking-widest text-gray-800 italic">
                        Home <span className="mx-1 text-gray-300">/</span>{" "}
                        Licores
                    </h3>
                </div>

                {/* FILA DE ENCABEZADOS SUPERIOR */}
                {/* items-baseline asegura que el texto de la izquierda y derecha compartan la misma base */}
                <div className="hidden md:flex items-baseline justify-between border-gray-100 pb-1 mb-2">
                    {/* Ancho fijo de 64 (mismo que el sidebar) para alinear el título */}
                    <div className="w-64">
                        <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-tight">
                            Filtrado por:
                        </h2>
                    </div>

                    {/* Conteo de productos - Ahora alineado a la izquierda del área de catálogo */}
                    <div className="flex-1 text-left ml-10">
                        {/* ml-10 para alinearlo con el inicio de la grid */}
                        <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                            {totalProducts} Products in total
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Filtros */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <FilterSidebar filtersData={filtersData} />
                    </div>

                    {/* Catálogo */}
                    <div className="flex-1">
                        {/* Grilla de Productos  */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                            {items.length > 0 ? (
                                items.map((product) => (
                                    <AnuncioProductCard
                                        key={product.id}
                                        product={product}
                                        index={product.id}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">
                                    No products found.
                                </p>
                            )}
                        </div>

                        {/* SECCIÓN DE PAGINACIÓN (Numeritos) */}
                      <div className="mt-10">
                {paginationLinks.length > 0 && (
                    <Pagination links={paginationLinks} />
                )}
            </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
