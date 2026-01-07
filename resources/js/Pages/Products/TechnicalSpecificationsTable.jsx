export default function TechnicalSpecificationsTable({ caracteristicas }) {
  if (!caracteristicas || caracteristicas.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-gray-900 via-darkGray to-gray-900 text-white py-6 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-turquoise/10 via-transparent to-darkTurquoise/10"></div>
        <h3 className="text-2xl font-black uppercase tracking-wide relative z-10">
          CARACTERÍSTICAS TÉCNICAS
        </h3>
        <div className="mt-2 w-20 h-1 bg-gradient-to-r from-turquoise to-darkTurquoise rounded-full relative z-10"></div>
      </div>

      {/* Table content */}
      <div className="divide-y divide-gray-200">
        {caracteristicas.map((item, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 px-8 transition-all duration-300 hover:bg-gradient-to-r hover:from-turquoise/5 hover:to-transparent group ${
              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
            }`}
          >
            <div className="font-bold text-gray-900 text-sm sm:text-base uppercase tracking-wide group-hover:text-darkTurquoise transition-colors duration-300">
              {item.nombre}
            </div>
            <div className="text-gray-700 text-sm sm:text-base sm:text-right font-medium">
              {item.valor}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom decoration */}
      <div className="h-2 bg-gradient-to-r from-turquoise via-darkTurquoise to-turquoise"></div>
    </div>
  );
}
