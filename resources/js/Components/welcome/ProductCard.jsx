import { Link, router } from "@inertiajs/react";
import { slugify } from "../../utils/slugify";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductCard({ product }) {
    const totalStock =
        product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

    const isOutOfStock = totalStock === 0;

    const imageUrl =
        product.multimedia?.[0]?.url || "https://via.placeholder.com/600x800";

    console.log(`Imagen de ${product.name}:`, imageUrl);

    return (
        <Link
            href={`/products/${slugify(product.name)}/${product.id}`}
            className={` w-full h-full relative overflow-hidden rounded-3xl shadow-xl border     bg-white transition-all  duration-500 hover:scale-105  hover:shadow-2xl
        ${
            isOutOfStock
                ? "border-darkTurquoise opacity-80"
                : "border-gray-200 hover:border-red-600"
        }
      `}
            style={{ fontFamily: "'Playfair Display', serif" }}
        >
            <div className="w-full aspect-[4/5] p-4 bg-white border-b border-grayCustom/30 rounded-t-3xl overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105 hover:rotate-1"
                />
            </div>

            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-extrabold uppercase tracking-wide text-darkGray">
                    {product.name}
                </h3>
                <h2 className="text-lg font-medium text-gray-900 h-15 overflow-hidden">
                    {product.description}
                </h2>

                <p className="text-2xl text-center font-extrabold tracking-wide text-red-600">
                    $ {Number(product.price).toFixed(0)}
                </p>

                {/** consultar disponibilidad */}
                <motion.span
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.visit(
                            `/products/${slugify(product.name)}/${product.id}`,
                        );
                    }}
                    // IMPORTANTE: relative permite que la línea se ubique respecto a este texto
                    className="relative mt-1 inline-block text-center text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 cursor-pointer select-none"
                    initial="rest"
                    whileHover="hover" // Dispara la variante "hover" en los hijos
                    animate="rest"
                >
                    Consultar disponibilidad
                    {/* Línea animada */}
                    <motion.span
                        variants={{
                            rest: {
                                scaleX: 0,
                                opacity: 0,
                                transition: { duration: 0.3 },
                            },
                            hover: {
                                scaleX: 1,
                                opacity: 1,
                                transition: { duration: 0.3 },
                            },
                        }}
                        className="absolute left-0 -bottom-1 h-[2px] w-full bg-red-600 rounded-full"
                        style={{ originX: 0 }} // La línea crece de izquierda a derecha
                    />
                </motion.span>

                {/*mapeo de variantes*/}
                <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                        <span
                            key={v.id}
                            className={` px-3 py-1 text-sm   font-semibold rounded-full    border       transition
                ${
                    v.stock === 0
                        ? "bg-darkGray text-white border-darkGray"
                        : "bg-white text-darkGray border-red-600 hover:bg-red-200 hover:text-darkGray"
                }
              `}
                        >
                            {v.values[0]?.value}
                        </span>
                    ))}
                    {/* BOTÓN para agregar al carrito */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.post("/cart/add", {
                                product_id: product.id,
                                quantity: 1,
                            });
                        }}
                        disabled={isOutOfStock}
                        className={`mt-2 w-full px-4 py-2 text-sm font-bold text-white rounded-full transition-colors duration-300 ${
                            isOutOfStock
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 cursor-pointer"
                        }`}
                    >
                        Agregar al carrito
                    </button>
                    {/* Etiqueta de Agotado si aplica */}
                    {isOutOfStock && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                            Agotado
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
