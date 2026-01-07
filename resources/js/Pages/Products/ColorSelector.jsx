import { useState } from "react";

export default function ColorSelector({ colors, productName, productImage }) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Side - Info */}
      <div className="space-y-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        <h2 className="text-4xl font-bold text-darkGray">COLORES</h2>
        <h3 className="text-3xl font-bold text-turquoise">{productName}</h3>
        <p className="text-lg text-grayCustom leading-relaxed">
          Todo lo que se necesita para el trabajo diario, brindándote la
          capacidad y el confort necesario.
        </p>

        {/* Color Options */}
        <div className="space-y-4">
          <p className="text-sm text-grayCustom italic">
            *Los colores pueden variar debido a la calibración de la pantalla.
          </p>
          <div className="flex gap-4 items-center">
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(color)}
                className={`relative w-14 h-14 rounded-full border-4 transition-all ${
                  selectedColor.name === color.name
                    ? "border-turquoise scale-110 shadow-xl"
                    : "border-gray-300 hover:border-grayCustom"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {selectedColor.name === color.name && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold text-darkGray">
                    {color.name}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Vehicle Image */}
      <div className="relative">
        <img
          src={productImage}
          alt={`${productName} - ${selectedColor.name}`}
          className="w-full h-auto rounded-2xl shadow-2xl"
        />
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">
          <p className="text-sm text-grayCustom">Color seleccionado:</p>
          <p className="text-lg font-bold text-darkGray">{selectedColor.name}</p>
        </div>
      </div>
    </div>
  );
}
