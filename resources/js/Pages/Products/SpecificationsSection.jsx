export default function SpecificationsSection({
  activeTab,
  multimedia,
  caracteristicas,
}) {
  // Filtrar multimedia por tipo según multimedia_type_id
  // 1 = General, 2 = Galeria, 3 = Interior, 4 = Exterior, 5 = Performance, 6 = Seguridad

  const interiorImages = multimedia.filter((m) => m.multimedia_type_id === 3 && m.type !== "video");
  const exteriorImages = multimedia.filter((m) => m.multimedia_type_id === 4 && m.type !== "video");
  const performanceImages = multimedia.filter((m) => m.multimedia_type_id === 5 && m.type !== "video");
  const seguridadImages = multimedia.filter((m) => m.multimedia_type_id === 6 && m.type !== "video");
  const galeriaImages = multimedia.filter((m) => m.multimedia_type_id === 2 && m.type !== "video");

  return (
    <div className="min-h-[400px]">
      {/* INTERIOR */}
      {activeTab === "interior" && (
        <div>
          <h3 className="text-3xl font-black text-gray-900 mb-3 text-center uppercase tracking-tight">
            INTERIOR
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-turquoise to-darkTurquoise rounded-full mx-auto mb-8"></div>

          {interiorImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {interiorImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-2xl overflow-hidden shadow-xl group cursor-pointer border-2 border-gray-200 hover:border-turquoise transition-all duration-500 hover:shadow-2xl"
                >
                  <img
                    src={img.url}
                    alt={`Interior ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Vista {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                No hay imágenes de interior disponibles
              </p>
            </div>
          )}
        </div>
      )}

      {/* EXTERIOR */}
      {activeTab === "exterior" && (
        <div>
          <h3 className="text-3xl font-black text-gray-900 mb-3 text-center uppercase tracking-tight">
            EXTERIOR
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-turquoise to-darkTurquoise rounded-full mx-auto mb-8"></div>

          {exteriorImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exteriorImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-2xl overflow-hidden shadow-xl group cursor-pointer border-2 border-gray-200 hover:border-turquoise transition-all duration-500 hover:shadow-2xl"
                >
                  <img
                    src={img.url}
                    alt={`Exterior ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Vista {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                No hay imágenes de exterior disponibles
              </p>
            </div>
          )}
        </div>
      )}

      {/* PERFORMANCE */}
      {activeTab === "performance" && (
        <div>
          <h3 className="text-3xl font-black text-gray-900 mb-3 text-center uppercase tracking-tight">
            PERFORMANCE
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-turquoise to-darkTurquoise rounded-full mx-auto mb-8"></div>

          {performanceImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {performanceImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-2xl overflow-hidden shadow-xl group cursor-pointer border-2 border-gray-200 hover:border-turquoise transition-all duration-500 hover:shadow-2xl"
                >
                  <img
                    src={img.url}
                    alt={`Performance ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Vista {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                No hay imágenes de performance disponibles
              </p>
            </div>
          )}
        </div>
      )}

      {/* SEGURIDAD */}
      {activeTab === "seguridad" && (
        <div>
          <h3 className="text-3xl font-black text-gray-900 mb-3 text-center uppercase tracking-tight">
            SEGURIDAD
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-turquoise to-darkTurquoise rounded-full mx-auto mb-8"></div>

          {seguridadImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seguridadImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-2xl overflow-hidden shadow-xl group cursor-pointer border-2 border-gray-200 hover:border-turquoise transition-all duration-500 hover:shadow-2xl"
                >
                  <img
                    src={img.url}
                    alt={`Seguridad ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Vista {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                No hay imágenes de seguridad disponibles
              </p>
            </div>
          )}
        </div>
      )}

      {/* GALERÍA */}
      {activeTab === "galería" && (
        <div>
          <h3 className="text-3xl font-black text-gray-900 mb-3 text-center uppercase tracking-tight">
            GALERÍA
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-turquoise to-darkTurquoise rounded-full mx-auto mb-8"></div>

          {galeriaImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galeriaImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-xl group cursor-pointer border-2 border-gray-200 hover:border-turquoise transition-all duration-500 hover:shadow-2xl"
                >
                  <img
                    src={img.url}
                    alt={`Galería ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-3 left-3 text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Imagen {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                No hay imágenes en la galería
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
