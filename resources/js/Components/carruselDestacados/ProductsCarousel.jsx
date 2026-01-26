//COMPONENTE PRINCIPAL CARRUSEL DE PRODUCTOS
//descripción: Componente de carrusel para mostrar productos destacados con navegación y diseño responsivo.

import React, { useRef, useState, useEffect } from "react";
import FeaturedProductCard from "./FeaturedProductCard";
import CarouselButton from "./CarouselButton";

export default function ProductCarousel({ products, title, subtitle }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            // Calculamos el ancho de una tarjeta para un scroll preciso
            const cardWidth = scrollRef.current.clientWidth;
            const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [products]);

    return (
        <section className="py-12 px-4 max-w-[1400px] mx-auto overflow-hidden overflow-x-clip relative">
            <div className="text-center mb-6">
                <h2 className=" md:text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                    {title}
                </h2>
                <p className="text-gray-500 text-lg font-medium">{subtitle}</p>
            </div>

            <div className="relative group mx-auto px-2 md:px-5">

                {/* Reducimos px para que las flechas respiren */}
                <CarouselButton
                    direction="left"
                    onClick={() => scroll("left")}
                    disabled={!canScrollLeft}
                />
                <CarouselButton
                    direction="right"
                    onClick={() => scroll("right")}
                    disabled={!canScrollRight}
                />

                {/* Contenedor del carrusel */}
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    // gap-6 da una separación más elegante similar a tu imagen de filtros
                    className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 px-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {products.map((product, index) => (
                        <div
                           key={`carousel-item-${product.id}-${index}`}
                            // Ajuste preciso para 5 columnas considerando gap-6 (24px)
                            className="flex-none w-[90%] md:w-[calc(33.33%-24px)] lg:w-[calc(20%-13px)] snap-start"
                        >
                            <FeaturedProductCard product={product} index={index} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
