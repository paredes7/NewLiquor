export default function FeatureHighlights({ specifications }) {
  const features = [
    {
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      label: "MOTOR",
      value: specifications.motor,
    },
    {
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12 6 2.12v4.78z" />
        </svg>
      ),
      label: "TRANSMISIÓN",
      value: specifications.transmision,
    },
    {
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.07 4.93l-1.41 1.41C19.1 7.79 20 9.79 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.08 3.05-7.44 7-7.93v2.02C8.16 6.57 6 9.03 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.66-.67-3.16-1.76-4.24l-1.41 1.41C15.55 9.89 16 10.9 16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.86 1.28-3.41 3-3.86V6.07c-2.89.48-5 3-5 6.07 0 3.31 2.69 6 6 6 1.66 0 3.16-.67 4.24-1.76l1.41 1.41C16.21 19.1 14.21 20 12 20c-4.42 0-8-3.58-8-8 0-4.08 3.05-7.44 7-7.93V2.05C6.82 2.52 3 6.86 3 12c0 4.97 4.03 9 9 9 2.39 0 4.68-.94 6.36-2.64l1.41 1.41C17.68 21.85 14.95 23 12 23 5.93 23 1 18.07 1 12S5.93 1 12 1c2.95 0 5.68 1.15 7.78 3.22l1.41-1.41C18.85 .47 15.61-.71 12 .71z" />
        </svg>
      ),
      label: "POTENCIA",
      value: specifications.potencia,
    },
    {
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
      label: "PESO",
      value: specifications.peso,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="group relative bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl text-center space-y-3 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-200"
        >
          {/* Icon */}
          <div className="w-14 h-14 mx-auto text-turquoise group-hover:text-darkTurquoise transition-colors duration-300">
            {feature.icon}
          </div>

          {/* Content */}
          <div>
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              {feature.label}
            </p>
            <p className="text-sm font-bold text-gray-900 mt-2">
              {feature.value}
            </p>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-turquoise/5 to-darkTurquoise/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
}
