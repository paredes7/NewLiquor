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

  // Especificaciones del producto (vienen de la BD)
  const specifications = {
    motor: product.specifications?.motor || "N/A",
    potencia: product.specifications?.potencia || "N/A",
    transmision: product.specifications?.transmision || "N/A",
    peso: product.specifications?.peso || "N/A",
  };

  // Características adicionales de la tabla 'caracteristicas'
  const caracteristicas = product.caracteristicas || [];

  // Colores (puedes quitar esta sección si no tienes colores en la BD)
  const availableColors = product.colors || [];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-8 h-fit">
            <EnhancedGallery
              multimedia={multimedia}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-turquoise to-darkTurquoise rounded-full"></div>
            </div>

            {/* Description */}
            <div className="text-base sm:text-lg text-gray-700 leading-relaxed font-light">
              {product.longDescription ? (
                <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
              ) : (
                <p>{product.description}</p>
              )}
            </div>

            {/* Feature Highlights */}
            <div className="pt-4">
              <FeatureHighlights specifications={specifications} />
            </div>

            {/* Technical Specifications Table from BD */}
            <TechnicalSpecificationsTable caracteristicas={caracteristicas} />

            {/* CTA Buttons */}
            <div className="space-y-4 pt-4">
              {/* Quote Button */}
              <a
                href={`https://wa.me/56978843627?text=Hola!%20Estoy%20interesado%20en%20cotizar:%0A${encodeURIComponent(
                  product.name
                )}%0A${encodeURIComponent(currentUrl)}`}
                target="_blank"
                className="block text-center w-full py-4 px-6 rounded-xl bg-gradient-to-r from-turquoise to-darkTurquoise text-white font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  Cotizar por WhatsApp
                </span>
              </a>

              {/* Download Technical Sheet */}
              {product.technical_sheet_url && (
                <a
                  href={product.technical_sheet_url}
                  download
                  className="block text-center w-full py-4 px-6 rounded-xl border-2 border-gray-900 text-gray-900 font-bold text-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar Ficha Técnica
                  </span>
                </a>
              )}
            </div>
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
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-gray-900 tracking-tight">
              Características
            </h2>
            <div className="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-turquoise to-darkTurquoise rounded-full"></div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["interior", "exterior", "performance", "seguridad", "galería"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-bold text-sm uppercase rounded-lg transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-turquoise to-darkTurquoise text-white shadow-xl scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            <SpecificationsSection
              activeTab={activeTab}
              multimedia={multimedia}
              caracteristicas={caracteristicas}
            />
          </div>
        </div>
      </div>

    </div>
  );
}