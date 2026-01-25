import Layout from "@/Layouts/MainLayout";
import Banner from "@/Components/welcome/WelcomeSe/Banner";
import WelcomeSection from "@/Components/welcome/WelcomeSe/WelcomeSection";
import CategoriesGrid from "@/Components/welcome/WelcomeSe/CategoriesGrid";
import CTAContact from "@/Components/welcome/WelcomeSe/CTAContact";
import ProductShopSection from "@/Components/filterProduct/ProductShopSection";
import Pagination from "@/Components/filterProduct/Paginacion";
import ProductsCarousel from "@/Components/carruselDestacados/ProductsCarousel";

export default function Welcome({
    categories,
    products,
    filtersData,
    search,
    page,
    hasMore,
    totalProducts,
    featuredProducts,
}) {
    console.log("Datos que llegan de Laravel:", {
        categories,
        products,
        filtersData,
    });

    console.log(products);
console.log("productos destacados", featuredProducts);

    return (
        <Layout title="Pragati Motors | Bolivia">
            <Banner img="https://res.cloudinary.com/dnbklbswg/image/upload/v1767755747/banner_yfcfdc.jpg" />

            <WelcomeSection />

            <CategoriesGrid categories={categories} hasMore={hasMore} />

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
