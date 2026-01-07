import { Link } from "@inertiajs/react";
import { slugify } from "../../utils/slugify";

export default function ProductCard({ product }) {

  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

  const isOutOfStock = totalStock === 0;

  const imageUrl =
    product.multimedia?.[0]?.url ||
    "https://via.placeholder.com/600x800";

  return (
    <Link
      href={`/products/${slugify(product.name)}/${product.id}`}
      className={`
        w-full
        h-full
        relative
        overflow-hidden
        rounded-3xl
        shadow-xl
        border
        bg-white
        transition-all
        duration-500
        hover:scale-105
        hover:shadow-2xl
        ${isOutOfStock
          ? "border-darkTurquoise opacity-80"
          : "border-gray-200 hover:border-turquoise"}
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

      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-xl font-extrabold uppercase tracking-wide text-darkGray">
          {product.name}
        </h3>

        
        <div className="flex flex-wrap gap-2">
          {product.variants?.map(v => (
            <span
              key={v.id}
              className={`
                px-3
                py-1
                text-sm
                font-semibold
                rounded-full
                border
                transition
                ${v.stock === 0
                  ? "bg-darkGray text-white border-darkGray"
                  : "bg-white text-darkGray border-turquoise hover:bg-turquoise hover:text-darkGray"}
              `}
            >
              {v.values[0]?.value}
            </span>
          ))}
        </div>

        
        <p className="text-2xl font-extrabold tracking-wide text-turquoise">
          $ {Number(product.price).toFixed(0)}
        </p>
      </div>
    </Link>
  );
}
