export default function SpecificationsSection({
  activeTab,
  features,
  multimedia,
}) {
  // Imágenes de galería (sin videos)
  const galleryImages = multimedia.filter((m) => m.type !== "video");

  return (
    <div className="min-h-[400px]">
      {activeTab === "interior" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.interior && features.interior.length > 0 ? (
            features.interior.map((feature, idx) => (
              <div key={idx} className="space-y-4">
                {feature.image && (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full aspect-video object-cover rounded-lg shadow-lg"
                  />
                )}
                <h3 className="text-xl font-bold text-darkGray">
                  {feature.title}
                </h3>
                <p className="text-grayCustom">{feature.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2">
              <h3 className="text-2xl font-bold text-darkGray mb-6 text-center">
                INTERIOR
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Placeholder interior features */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-16 h-16 bg-turquoise/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-8 h-8 text-turquoise"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-center text-darkGray mb-2">
                    Asientos Cómodos
                  </h4>
                  <p className="text-grayCustom text-center text-sm">
                    Diseñados para largas jornadas de trabajo
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-16 h-16 bg-turquoise/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-8 h-8 text-turquoise"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-center text-darkGray mb-2">
                    Panel de Instrumentos Digital
                  </h4>
                  <p className="text-grayCustom text-center text-sm">
                    Información clara y precisa al alcance
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-16 h-16 bg-turquoise/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-8 h-8 text-turquoise"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-center text-darkGray mb-2">
                    Sistema de Audio
                  </h4>
                  <p className="text-grayCustom text-center text-sm">
                    Entretenimiento para tus viajes
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-16 h-16 bg-turquoise/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-8 h-8 text-turquoise"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-center text-darkGray mb-2">
                    Aire Acondicionado
                  </h4>
                  <p className="text-grayCustom text-center text-sm">
                    Climatización para todas las condiciones
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "exterior" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.exterior && features.exterior.length > 0 ? (
            features.exterior.map((feature, idx) => (
              <div key={idx} className="space-y-4">
                {feature.image && (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full aspect-video object-cover rounded-lg shadow-lg"
                  />
                )}
                <h3 className="text-xl font-bold text-darkGray">
                  {feature.title}
                </h3>
                <p className="text-grayCustom">{feature.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2">
              <h3 className="text-2xl font-bold text-darkGray mb-6 text-center">
                EXTERIOR
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-16 h-16 bg-turquoise/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-8 h-8 text-turquoise"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-center text-darkGray mb-2">
                    Diseño Robusto
                  </h4>
                  <p className="text-grayCustom text-center text-sm">
                    Construcción duradera para trabajo pesado
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-16 h-16 bg-turquoise/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-8 h-8 text-turquoise"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-center text-darkGray mb-2">
                    Luces LED
                  </h4>
                  <p className="text-grayCustom text-center text-sm">
                    Mayor visibilidad y seguridad
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "performance" && (
        <div className="max-w-3xl mx-auto">
          {features.performance && features.performance.length > 0 ? (
            <div className="space-y-6">
              {features.performance.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-6 rounded-xl flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-turquoise rounded-lg flex-shrink-0"></div>
                  <div>
                    <h4 className="text-lg font-bold text-darkGray mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-grayCustom">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-darkGray mb-6 text-center">
                PERFORMANCE
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-darkGray mb-2">
                    Motor Potente
                  </h4>
                  <p className="text-grayCustom">
                    Diseñado para ofrecer el mejor rendimiento en todo tipo de terrenos
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-darkGray mb-2">
                    Eficiencia de Combustible
                  </h4>
                  <p className="text-grayCustom">
                    Optimizado para reducir costos operativos
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-darkGray mb-2">
                    Transmisión Manual
                  </h4>
                  <p className="text-grayCustom">
                    Control total sobre la potencia del vehículo
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "seguridad" && (
        <div className="max-w-3xl mx-auto">
          {features.seguridad && features.seguridad.length > 0 ? (
            <div className="space-y-6">
              {features.seguridad.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-6 rounded-xl flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-turquoise rounded-lg flex-shrink-0"></div>
                  <div>
                    <h4 className="text-lg font-bold text-darkGray mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-grayCustom">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-darkGray mb-6 text-center">
                SEGURIDAD
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-darkGray mb-2">
                    Frenos ABS
                  </h4>
                  <p className="text-grayCustom">
                    Sistema antibloqueo para mayor control
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-darkGray mb-2">
                    Estructura Reforzada
                  </h4>
                  <p className="text-grayCustom">
                    Protección adicional para el conductor y pasajeros
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-darkGray mb-2">
                    Espejos Retrovisores Amplios
                  </h4>
                  <p className="text-grayCustom">
                    Mejor visibilidad de los alrededores
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "galería" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.length > 0 ? (
            galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden shadow-lg group cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-grayCustom text-lg">
                No hay imágenes adicionales en la galería
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}