// resources/js/Pages/Products/TechnicalSpecificationsTable.jsx
import React from 'react';

export default function TechnicalSpecificationsTable({ specifications }) {
  // Mapeo para que las claves se vean bonitas (o puedes usar las keys directas)
  const labels = {
    motor: "MOTOR",
    potencia: "POTENCIA / TORQUE",
    combustible: "COMBUSTIBLE",
    transmision: "TRANSMISIÓN",
    cabina: "TIPO DE CABINA",
    capacidad_carga: "CAPACIDAD DE CARGA",
  };

  // Función auxiliar para formatear claves si no están en el mapa 'labels'
  const getLabel = (key) => labels[key] || key.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Cabecera de la tabla */}
      <div className="bg-darkGray px-6 py-3">
        <h3 className="text-white font-bold text-md uppercase tracking-wider flex items-center gap-2">
          <svg className="w-5 h-5 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Especificaciones Técnicas
        </h3>
      </div>
      
      {/* Cuerpo de la tabla */}
      <div className="divide-y divide-gray-100 bg-white">
        {Object.entries(specifications).map(([key, value], index) => (
          <div 
            key={key} 
            className={`grid grid-cols-3 transition hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
          >
            <div className="col-span-1 px-5 py-3 flex items-center border-r border-gray-100">
              <span className="font-bold text-darkGray text-xs md:text-sm uppercase">
                {getLabel(key)}
              </span>
            </div>
            <div className="col-span-2 px-5 py-3 flex items-center">
              <span className="text-grayCustom text-sm font-medium">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}