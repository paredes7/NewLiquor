import { useState } from "react";
import { useCart } from "@/Contexts/CartContext";
import EnhancedGallery from "./EnhancedGallery";
import SpecificationsSection from "./SpecificationsSection";
import ColorSelector from "./ColorSelector";
import FeatureHighlights from "./FeatureHighlights";

export default function VehicleShowcase({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.find((v) => v.stock > 0) || null
  );

  const [quantity, setQuantity] = useState(
    selectedVariant ? Math.min(1, selectedVariant.stock) : 1
  );

  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("interior");

  const { addToCart } = useCart();

  const multimedia = product.multimedia || [];
  const mainImage =
    multimedia.find((m) => m.type !== "video")?.url ||
    "https://via.placeholder.com/600x400";

  const stock = selectedVariant?.stock || 0;
  const isOutOfStock = stock === 0;
  const currentUrl = window.location.href;

  const selectedAttribute =
    selectedVariant?.values[0]?.attribute || "Variante";
  const selectedValue = selectedVariant?.values[0]?.value || "";

  const handleAddToCart = async () => {
    if (!selectedVariant || isOutOfStock) return;

    setAdding(true);

    await addToCart({
      id: product.id,
      nombre: product.name,
      precio: selectedVariant.price,
      cantidad: quantity,
      image: mainImage,
      sku: selectedVariant.sku,
      stock: selectedVariant.stock,
      variant: `${selectedAttribute}: ${selectedValue}`,
    });

    setAdding(false);
    setSuccess(true);

    setTimeout(() => setSuccess(false), 1500);
  };

  // Datos de ejemplo - estos deberían venir del backend
  const specifications = {
    motor: product.specifications?.motor || "N/A",
    potencia: product.specifications?.potencia || "N/A",
    combustible: product.specifications?.combustible || "N/A",
    transmision: product.specifications?.transmision || "N/A",
    cabina: product.specifications?.cabina || "N/A",
    capacidad_carga: product.specifications?.capacidad_carga || "N/A",
  };

  const availableColors = product.colors || [
    { name: "Blanco", hex: "#FFFFFF" },
    { name: "Amarillo", hex: "#FFD700" },
    { name: "Rojo", hex: "#DC143C" },
  ];

  const features = {
    interior: product.features?.interior || [],
    exterior: product.features?.exterior || [],
    performance: product.features?.performance || [],
    seguridad: product.features?.seguridad || [],
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <EnhancedGallery
              multimedia={multimedia}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div
            className="space-y-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold uppercase text-darkGray">
              {product.name}
            </h1>

            <p className="text-lg text-grayCustom leading-relaxed">
              {product.description}
            </p>

            {/* Feature Highlights */}
            <FeatureHighlights specifications={specifications} />

            {/* Download Technical Sheet */}
            {product.technical_sheet_url && (
              <div className="bg-gray-100 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-darkGray mb-3">
                  DESCARGA LA FICHA TÉCNICA
                </h3>
                <a
                  href={product.technical_sheet_url}
                  download
                  className="block w-full py-3 bg-darkGray text-white text-center font-bold rounded-lg hover:bg-turquoise transition"
                >
                  Ficha Técnica
                </a>
              </div>
            )}

            {/* Quote Button */}
            <a
              href={`https://wa.me/56978843627?text=Hola!%20Estoy%20interesado%20en%20cotizar:%0A${encodeURIComponent(
                product.name
              )}%0A${encodeURIComponent(currentUrl)}`}
              target="_blank"
              className="block text-center w-full py-4 rounded-xl bg-turquoise text-darkGray font-bold text-lg hover:bg-darkTurquoise transition shadow-xl"
            >
              Cotizar
            </a>
          </div>
        </div>
      </div>

      {/* Color Selector Section */}
      {availableColors.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <ColorSelector
              colors={availableColors}
              productName={product.name}
              productImage={mainImage}
            />
          </div>
        </div>
      )}

      {/* Characteristics Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-10 text-darkGray"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            CARACTERÍSTICAS
          </h2>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-0 mb-8 bg-darkGray">
            {["interior", "exterior", "performance", "seguridad", "galería"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[120px] py-4 px-6 font-bold text-sm uppercase transition ${
                    activeTab === tab
                      ? "bg-white text-darkGray"
                      : "bg-darkGray text-white hover:bg-gray-700"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Tab Content */}
          <SpecificationsSection
            activeTab={activeTab}
            features={features}
            multimedia={multimedia}
          />
        </div>
      </div>

      {/* Variant Selection (if applicable) */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div
              className="max-w-3xl mx-auto space-y-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <h2 className="text-3xl font-bold text-center text-darkGray mb-8">
                SELECCIONA TU VERSIÓN
              </h2>

              <p className="text-3xl font-bold text-turquoise text-center">
                $ {Number(selectedVariant?.price ?? product.price).toFixed(0)}
              </p>

              {selectedVariant && (
                <p className="text-md text-grayCustom font-semibold text-center">
                  SKU:{" "}
                  <span className="font-bold text-darkGray">
                    {selectedVariant.sku}
                  </span>
                </p>
              )}

              <div>
                <h3 className="text-xl font-semibold text-darkGray mb-4">
                  {selectedAttribute}:
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {product.variants.map((v) => {
                    const label = v.values[0]?.value;
                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariant(v);
                          setQuantity(1);
                        }}
                        disabled={v.stock === 0}
                        className={`min-w-[80px] px-6 py-3 border-2 rounded-lg text-lg font-bold transition ${
                          selectedVariant?.id === v.id
                            ? "bg-turquoise text-darkGray border-turquoise"
                            : "bg-white text-darkGray border-grayCustom"
                        } ${
                          v.stock === 0
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:border-darkTurquoise"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedVariant && (
                <div className="pt-4">
                  {isOutOfStock ? (
                    <p className="text-red-500 font-bold text-lg text-center">
                      NO DISPONIBLE
                    </p>
                  ) : (
                    <>
                      <p className="font-semibold text-darkGray text-center">
                        Stock disponible: {stock}
                      </p>
                      <div className="w-full h-2 bg-grayCustom/30 rounded-full mt-2">
                        <div
                          className="h-full bg-darkTurquoise rounded-full transition-all"
                          style={{
                            width: `${Math.min((stock / 20) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {!isOutOfStock && selectedVariant && (
                <div className="flex items-center justify-center gap-6">
                  <h3 className="text-lg font-semibold text-darkGray">
                    Cantidad:
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-12 h-12 border-2 border-grayCustom rounded-full text-2xl hover:border-turquoise transition font-bold"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-darkGray min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => (q < stock ? q + 1 : q))
                      }
                      className="w-12 h-12 border-2 border-grayCustom rounded-full text-2xl hover:border-turquoise transition font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                disabled={!selectedVariant || isOutOfStock || adding}
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl text-lg font-bold transition ${
                  !selectedVariant || isOutOfStock
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-turquoise text-darkGray hover:bg-darkTurquoise shadow-xl"
                }`}
              >
                {adding ? "Añadiendo..." : success ? "Añadido ✓" : "Añadir al carrito"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}