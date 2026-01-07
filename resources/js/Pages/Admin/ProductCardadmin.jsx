import { Link } from "@inertiajs/react";
import { slugify } from "../../utils/slugify";

export default function ProductCardadmin({ product }) {
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const isOutOfStock = totalStock === 0;
  const imageUrl = product.multimedia?.[0]?.url || "https://via.placeholder.com/600x800";

  return (
    <Link
      href={`/admin/products/${slugify(product.name)}/${product.id}`}
      className={`w-full h-full relative overflow-hidden rounded-3xl shadow-xl border
        ${isOutOfStock ? "border-black opacity-80" : "border-gray-200"}
        bg-white text-black hover:scale-105 hover:shadow-2xl transition-all duration-500`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >

      <div className="w-full aspect-[4/5] flex justify-center items-center p-4 bg-white border-b border-gray-200 rounded-t-3xl overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-105 hover:rotate-1"
        />
      </div>

      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-xl font-extrabold uppercase tracking-wide">
          {product.name}
        </h3>

        <div className="flex flex-wrap gap-2">
          {product.variants?.map((v) => (
            <span
              key={v.id}
              className={`px-3 py-1 border text-sm font-semibold rounded-full
                ${v.stock === 0
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
                }`}
            >
              {v.values[0]?.value}
            </span>
          ))}
        </div>

        <p className="text-2xl font-extrabold tracking-wide text-gray-900">
          $ {Number(product.price).toFixed(0)}
        </p>
      </div>
    </Link>
  );
}
