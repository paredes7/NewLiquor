import Layout from "@/Layouts/MainLayout";
import Carousel3D from "@/Components/welcome/CarouselCategories/Carousel3D";
import ProductShopSection from "@/Components/filterProduct/ProductShopSection";
import ProductsCarousel from "@/Components/carruselDestacados/ProductsCarousel";
import HomeSearch from "@/Components/search/HomeSearch";
import EventCarousel from "@/Components/welcome/Eventos/EventCarrusel";

export default function Welcome({
    categories,
    product,
    filtersData,
    hasMore,
    totalProducts,
    featuredProducts,
    eventos,
}) {
    console.log("--- DEBUG CATÁLOGO ---");
    console.log("Estructura completa de product:", product);
    console.log("TotalProducts", totalProducts);
    // Si usas paginación de Laravel, los datos están en product.data
    const listaActual = product.data || product;
    console.log("Lista de productos a renderizar:", listaActual);
    
    // Ver nombres para comparar con el backend
    if(Array.isArray(listaActual)) {
        console.table(listaActual.map(p => ({
            id: p.id,
            nombre: p.product?.name || "Sin nombre",
            categoria: p.product?.category?.name || "Sin categoría"
        })));
    }
    console.log("----------------------");

    return (
        <Layout title="Inicio">
            <div className="bg-[#F5C15B] min-h-screen">
                <HomeSearch />
                    <Carousel3D />
                    <EventCarousel eventos={eventos} />
                    <ProductsCarousel
                        title="Lo más destacado de hoy"
                        subtitle="Nuestras mejores recomendaciones de las bebidas más espectaculares."
                        products={featuredProducts.data || featuredProducts}
                    />
                    <ProductShopSection
                        product={product}
                        filtersData={filtersData || []}
                        totalProducts={totalProducts}
                    />
            </div>
        </Layout>
    );
}
