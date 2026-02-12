import Layout from "@/Layouts/MainLayout";
import CategoriesGrid from "@/Components/welcome/CategoriesGrid";
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
    console.log("Datos que llegan de Laravel:", {
        categories,
        product,
        filtersData,
    });

    console.log('products', product);
    console.log("evento destacado", eventos);
    console.log("filtros", filtersData);
    console.log("productos destacados", featuredProducts);

    return (
        <Layout title="Inicio">
            <HomeSearch />

            {/** <Banner img="https://res.cloudinary.com/dnbklbswg/image/upload/v1767755747/banner_yfcfdc.jpg" />
             *  <WelcomeSection />
             */}

            <CategoriesGrid categories={categories} />
            <EventCarousel eventos={eventos} />

            <ProductsCarousel
                title="Lo más destacado de hoy"
                subtitle="Nuestras mejores recomendaciones sobre destilados espectaculares."
                products={featuredProducts.data || featuredProducts}
            />

            {/* Así de simple lo pones ahora */}
            <ProductShopSection
                product={product}
                filtersData={filtersData || []}
                totalProducts={totalProducts}
            />
            
        </Layout>
    );
}
