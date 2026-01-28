//COMPONENT INJECTION (injeción de componentes)
//descripción: Componente de carrusel para mostrar productos destacados con navegación y diseño responsivo.

import React, { useRef, useState, useEffect } from "react";
import FeaturedProductCard from "./FeaturedProductCard";
import CarouselButton from "./CarouselButton";

export default function ProductCarousel({
    products,
    title = "",
    subtitle = "",
    columns = 5,
    CardComponent = FeaturedProductCard, //valor por defecto
}) {
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

    // Mapeo de anchos según el número de columnas deseado
    const columnWidths = {
        3: "md:w-[calc(33.33%-20px)] lg:w-[calc(33.33%-16px)]",
        5: "md:w-[calc(33.33%-24px)] lg:w-[calc(20%-13px)]",
    };

    if (!products || products.length === 0) {
        return (
            <h2 className="text-center mb-1 mt-3 text-red-900 text-xl font-medium">
                No hay productos disponibles
            </h2>
        );
    }

    return (
        <section className="py-12 px-4 max-w-[1400px] mx-auto overflow-hidden overflow-x-clip relative">
            {(title || subtitle) && (
                <div className="text-center mb-6">
                    {title && (
                        <h2 className="md:text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="text-gray-500 text-lg font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

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
                    className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-10 px-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {products?.map((product, index) => (
                        <div
                            key={`carousel-item-${product.id}-${index}`}
                            // Ajuste preciso para 5 columnas considerando gap-6 (24px)
                            className={`flex-none w-[90%] ${columnWidths[columns]} snap-start`}
                        >
                            <CardComponent product={product} index={index} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
