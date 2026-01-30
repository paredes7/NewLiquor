//COMPONENTE PARA LA SECCION DE ANUNCIOS EN LA PAGINA DE EVENTOS

import AdHeader from "./AdHeader";
import ProductsCarousel from "../../carruselDestacados/ProductsCarousel";
import ProductCard from "../ProductCard";

export default function AdSection({ title, description, product }) {
    return (
        <section className="bg-[#fdc2a0] pt-11 px-2 m-0 border-none outline-none ">
            {/* Encabezado del Anuncio */}
            <AdHeader title={title} description={description} />

            {/* Carrusel de Productos del Anuncio */}

            <ProductsCarousel
                products={product}
                columns={3}
                CardComponent={ProductCard}
            />
        </section>
    );
}
