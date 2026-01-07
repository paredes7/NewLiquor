/**
 * Ejemplo de datos de producto para VehicleShowcase
 *
 * Este archivo muestra la estructura completa de datos que espera el componente.
 * Úsalo como referencia para configurar tus productos en el backend.
 */

export const exampleVehicleProduct = {
  id: 1,
  name: "Aumark S | 3 Ton Furgón",
  description:
    "El Aumark S es el mejor compañero para tu negocio. Ideal para el trabajo en la ciudad, o para largas jornadas de trabajo en carretera. Su diseño y tecnología están especialmente pensados para maximizar el desempeño en las rutas para un eficiente funcionamiento en el transporte.",

  price: 15000000, // Precio base

  // Multimedia: array de objetos con imágenes y videos
  multimedia: [
    {
      id: 1,
      url: "/storage/vehicles/aumark-s/main.jpg",
      type: "image",
      sort_order: 1,
    },
    {
      id: 2,
      url: "/storage/vehicles/aumark-s/side-left.jpg",
      type: "image",
      sort_order: 2,
    },
    {
      id: 3,
      url: "/storage/vehicles/aumark-s/side-right.jpg",
      type: "image",
      sort_order: 3,
    },
    {
      id: 4,
      url: "/storage/vehicles/aumark-s/front.jpg",
      type: "image",
      sort_order: 4,
    },
    {
      id: 5,
      url: "/storage/vehicles/aumark-s/back.jpg",
      type: "image",
      sort_order: 5,
    },
    {
      id: 6,
      url: "/storage/vehicles/aumark-s/promo.mp4",
      type: "video",
      sort_order: 6,
    },
  ],

  // Variantes: diferentes versiones del producto
  variants: [
    {
      id: 1,
      sku: "AUM-S-3T-STD",
      price: 15000000,
      stock: 5,
      values: [
        {
          attribute: "Versión",
          value: "Estándar",
        },
      ],
    },
    {
      id: 2,
      sku: "AUM-S-3T-DLX",
      price: 17500000,
      stock: 3,
      values: [
        {
          attribute: "Versión",
          value: "Deluxe",
        },
      ],
    },
    {
      id: 3,
      sku: "AUM-S-3T-PREM",
      price: 19000000,
      stock: 2,
      values: [
        {
          attribute: "Versión",
          value: "Premium",
        },
      ],
    },
  ],

  // Especificaciones técnicas principales (se muestran en FeatureHighlights)
  specifications: {
    motor: "2TZH",
    potencia: "155hp / 240Nm",
    combustible: "Gasolina",
    transmision: "Manual 5G32",
    cabina: "Extendida con AC y Calefacción",
    capacidad_carga: "3,000 Kgs.",
  },

  // Colores disponibles
  colors: [
    { name: "Blanco", hex: "#FFFFFF" },
    { name: "Amarillo", hex: "#FFD700" },
    { name: "Rojo", hex: "#DC143C" },
  ],

  // URL de la ficha técnica (PDF descargable)
  technical_sheet_url: "/storage/documents/aumark-s-ficha-tecnica.pdf",

  // Características detalladas por categoría
  features: {
    // INTERIOR
    interior: [
      {
        title: "Panel de Instrumentos Digital",
        description:
          "Sistema de información completo con navegación, aplicaciones y servicios conectados. Pantalla táctil de 10 pulgadas para máximo control.",
        image: "/storage/vehicles/aumark-s/interior/panel.jpg",
      },
      {
        title: "Asientos Ergonómicos",
        description:
          "Diseñados para largas jornadas de trabajo, con soporte lumbar ajustable y tapizado resistente.",
        image: "/storage/vehicles/aumark-s/interior/seats.jpg",
      },
      {
        title: "Aire Acondicionado",
        description:
          "Sistema de climatización dual con control independiente para conductor y pasajero.",
        image: "/storage/vehicles/aumark-s/interior/ac.jpg",
      },
      {
        title: "Espacio de Almacenamiento",
        description:
          "Múltiples compartimentos para guardar documentos, herramientas y efectos personales.",
        image: "/storage/vehicles/aumark-s/interior/storage.jpg",
      },
    ],

    // EXTERIOR
    exterior: [
      {
        title: "Diseño Aerodinámico",
        description:
          "Carrocería diseñada para reducir resistencia al viento y mejorar eficiencia de combustible.",
        image: "/storage/vehicles/aumark-s/exterior/design.jpg",
      },
      {
        title: "Luces LED",
        description:
          "Sistema de iluminación LED de alta intensidad para mejor visibilidad nocturna y menor consumo energético.",
        image: "/storage/vehicles/aumark-s/exterior/lights.jpg",
      },
      {
        title: "Parachoques Reforzado",
        description:
          "Protección adicional contra impactos menores durante maniobras de carga.",
        image: "/storage/vehicles/aumark-s/exterior/bumper.jpg",
      },
      {
        title: "Espejos Eléctricos",
        description:
          "Espejos retrovisores con ajuste eléctrico y calefacción anti-empañamiento.",
        image: "/storage/vehicles/aumark-s/exterior/mirrors.jpg",
      },
    ],

    // PERFORMANCE
    performance: [
      {
        title: "Motor 2TZH de Alta Eficiencia",
        description:
          "Motor optimizado para ofrecer máxima potencia con menor consumo de combustible. Diseñado para trabajo pesado continuo.",
      },
      {
        title: "Transmisión Manual 5G32",
        description:
          "5 velocidades sincronizadas para control total en cualquier terreno. Cambios suaves y precisos.",
      },
      {
        title: "Suspensión Reforzada",
        description:
          "Sistema de suspensión diseñado para soportar cargas pesadas sin comprometer la comodidad de marcha.",
      },
      {
        title: "Sistema de Refrigeración Avanzado",
        description:
          "Mantiene el motor a temperatura óptima incluso en condiciones extremas de trabajo.",
      },
      {
        title: "Capacidad de Carga 3,000 Kg",
        description:
          "Chasis reforzado capaz de transportar hasta 3 toneladas con total seguridad.",
      },
    ],

    // SEGURIDAD
    seguridad: [
      {
        title: "Frenos ABS",
        description:
          "Sistema antibloqueo de frenos para mantener el control en frenadas de emergencia.",
      },
      {
        title: "Estructura de Cabina Reforzada",
        description:
          "Jaula de seguridad diseñada para proteger a los ocupantes en caso de colisión.",
      },
      {
        title: "Airbag Dual",
        description:
          "Bolsas de aire frontales para conductor y pasajero como protección adicional.",
      },
      {
        title: "Sistema de Control de Estabilidad",
        description:
          "Ayuda a mantener la trayectoria del vehículo en curvas y maniobras bruscas.",
      },
      {
        title: "Cinturones de Seguridad de 3 Puntos",
        description:
          "Cinturones reforzados con pretensores para todas las plazas.",
      },
      {
        title: "Cámara de Reversa",
        description:
          "Pantalla integrada en el panel que muestra la zona trasera durante maniobras de retroceso.",
      },
    ],
  },

  // Categoría del producto
  category: {
    id: 1,
    name: "Camiones",
    description: "Vehículos de carga para transporte comercial",
  },
};

/**
 * IMPORTANTE: Valores por Defecto
 *
 * Si NO proporcionas algunos campos opcionales, el componente mostrará:
 *
 * - specifications: Valores "N/A" en todos los campos
 * - colors: Array con 3 colores (Blanco, Amarillo, Rojo)
 * - features.interior: 4 características placeholder
 * - features.exterior: 2 características placeholder
 * - features.performance: 3 características placeholder
 * - features.seguridad: 3 características placeholder
 * - technical_sheet_url: Si es null, no se muestra el botón de descarga
 *
 * Ejemplo de producto MÍNIMO funcional:
 */

export const minimalVehicleProduct = {
  id: 2,
  name: "Producto Básico",
  description: "Descripción simple del producto",
  price: 10000000,

  multimedia: [
    { id: 1, url: "/storage/default.jpg", type: "image", sort_order: 1 },
  ],

  variants: [
    {
      id: 1,
      sku: "BASIC-001",
      price: 10000000,
      stock: 10,
      values: [{ attribute: "Versión", value: "Única" }],
    },
  ],

  // Estos campos son OPCIONALES
  // specifications: null, // Se usarán valores por defecto
  // colors: null, // Se usarán 3 colores por defecto
  // features: null, // Se usarán placeholders
  // technical_sheet_url: null, // No se mostrará el botón
};

/**
 * Cómo usar estos datos en tu backend:
 *
 * 1. En ProductController:
 *
 *    public function show($slug, Product $product)
 *    {
 *        $product->load(['multimedia', 'variants.attributeValues.attribute']);
 *
 *        return Inertia::render('Products/ShowVehicle', [
 *            'product' => $product
 *        ]);
 *    }
 *
 * 2. En tu seeder o factory:
 *
 *    Product::create([
 *        'name' => 'Aumark S | 3 Ton Furgón',
 *        'description' => '...',
 *        'price' => 15000000,
 *        'specifications' => json_encode([
 *            'motor' => '2TZH',
 *            'potencia' => '155hp / 240Nm',
 *            // ...
 *        ]),
 *        'colors' => json_encode([
 *            ['name' => 'Blanco', 'hex' => '#FFFFFF'],
 *            // ...
 *        ]),
 *        'features' => json_encode([
 *            'interior' => [...],
 *            'exterior' => [...],
 *            // ...
 *        ])
 *    ]);
 */
