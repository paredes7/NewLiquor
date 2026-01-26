import Layout from "@/Layouts/MainLayout";
import Banner from "@/Components/welcome/WelcomeSe/Banner";
import WelcomeSection from "@/Components/welcome/WelcomeSe/WelcomeSection";
import CategoriesGrid from "@/Components/welcome/WelcomeSe/CategoriesGrid";
import CTAContact from "@/Components/welcome/WelcomeSe/CTAContact";
import ProductShopSection from "@/Components/filterProduct/ProductShopSection";
import Pagination from "@/Components/filterProduct/Paginacion";
import ProductsCarousel from "@/Components/carruselDestacados/ProductsCarousel";
import HomeSearch from "@/Components/welcome/HomeSearch";
import EventCarousel from "@/Components/welcome/Eventos/EventCarrusel";

export default function Welcome({
    categories,
    products,
    filtersData,
    search,
    page,
    hasMore,
    totalProducts,
    featuredProducts,
    eventos,
}) {
    console.log("Datos que llegan de Laravel:", {
        categories,
        products,
        filtersData,
    });

    console.log(products);
    console.log("evento destacado", eventos);
    console.log("filtros", filtersData);
    console.log("productos destacados", featuredProducts);

    return (
        <Layout title="Pragati Motors | Bolivia">
            <HomeSearch />

            {/** <Banner img="https://res.cloudinary.com/dnbklbswg/image/upload/v1767755747/banner_yfcfdc.jpg" />
             *  <WelcomeSection />
             */}

            <CategoriesGrid categories={categories} hasMore={hasMore} />
            <EventCarousel eventos={eventos} />

            <ProductsCarousel
                title="Lo más destacado de hoy"
                subtitle="Nuestras mejores recomendaciones sobre destilados espectaculares."
                products={featuredProducts.data || featuredProducts}
            />

            {/* Así de simple lo pones ahora */}
            <ProductShopSection
                products={products}
                filtersData={filtersData || []}
                totalProducts={totalProducts}
            />
            <CTAContact />
        </Layout>
    );
}
