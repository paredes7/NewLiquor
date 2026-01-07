import { useState } from "react";
import { useCart } from "@/Contexts/CartContext";
import EnhancedGallery from "./EnhancedGallery";
import SpecificationsSection from "./SpecificationsSection";
import ColorSelector from "./ColorSelector";
import FeatureHighlights from "./FeatureHighlights";
import TechnicalSpecificationsTable from "./TechnicalSpecificationsTable";

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
            {/* 2. AQUÍ AÑADIMOS LA TABLA DE CARACTERÍSTICAS TÉCNICAS */}
            <TechnicalSpecificationsTable specifications={specifications} />

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

    </div>
  );
}