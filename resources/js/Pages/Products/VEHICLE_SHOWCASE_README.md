# Vehicle Showcase - Guía de Uso

Este documento explica cómo usar los nuevos componentes de showcase para vehículos (estilo Aumark/Foton).

## 📁 Archivos Creados

### Componentes Principales:
- **VehicleShowcase.jsx** - Componente principal con toda la lógica
- **EnhancedGallery.jsx** - Galería mejorada con thumbnails
- **SpecificationsSection.jsx** - Sección de características con tabs
- **ColorSelector.jsx** - Selector de colores del vehículo
- **FeatureHighlights.jsx** - Características destacadas con iconos

### Componentes Wrapper (Ejemplos):
- **ShowVehicle.jsx** - Vista de cliente
- **ShowVehicleadmin.jsx** - Vista de administrador

---

## 🚀 Cómo Usar

### Opción 1: Usar directamente en tu controlador

En tu `ProductController.php` o controlador correspondiente:

```php
public function show($slug, Product $product)
{
    $product->load(['multimedia', 'variants.attributeValues.attribute', 'category']);

    // Para productos tipo vehículo, usa ShowVehicle
    return Inertia::render('Products/ShowVehicle', [
        'product' => $product
    ]);

    // Para productos normales, sigue usando ShowProduct
    // return Inertia::render('Products/ShowProduct', [
    //     'product' => $product
    // ]);
}
```

### Opción 2: Modificar los componentes existentes

Puedes reemplazar el contenido de `Showcontent.jsx` con el nuevo `VehicleShowcase.jsx`:

1. Haz backup de `Showcontent.jsx`
2. Reemplaza su contenido con el de `VehicleShowcase.jsx`
3. Ajusta los imports si es necesario

---

## 📊 Estructura de Datos Esperada

El componente `VehicleShowcase` espera un objeto `product` con la siguiente estructura:

```javascript
{
  id: 1,
  name: "Aumark S | 3 Ton Furgón",
  description: "Descripción del producto...",
  price: 15000000,

  // Multimedia (imágenes y videos)
  multimedia: [
    { id: 1, url: "/storage/images/vehicle1.jpg", type: "image", sort_order: 1 },
    { id: 2, url: "/storage/images/vehicle2.jpg", type: "image", sort_order: 2 },
    { id: 3, url: "/storage/videos/promo.mp4", type: "video", sort_order: 3 }
  ],

  // Variantes (versiones del producto)
  variants: [
    {
      id: 1,
      sku: "AUM-S-3T-STD",
      price: 15000000,
      stock: 5,
      values: [
        { attribute: "Versión", value: "Estándar" }
      ]
    },
    {
      id: 2,
      sku: "AUM-S-3T-DLX",
      price: 18000000,
      stock: 3,
      values: [
        { attribute: "Versión", value: "Deluxe" }
      ]
    }
  ],

  // Especificaciones técnicas (OPCIONAL - se muestran valores por defecto si no existen)
  specifications: {
    motor: "2TZH",
    potencia: "155hp / 240Nm",
    combustible: "Gasolina",
    transmision: "Manual 5G32",
    cabina: "Extendida con AC y Calefacción",
    capacidad_carga: "3,000 Kgs."
  },

  // Colores disponibles (OPCIONAL)
  colors: [
    { name: "Blanco", hex: "#FFFFFF" },
    { name: "Amarillo", hex: "#FFD700" },
    { name: "Rojo", hex: "#DC143C" }
  ],

  // URL de ficha técnica (OPCIONAL)
  technical_sheet_url: "/storage/documents/aumark-s-ficha.pdf",

  // Características por sección (OPCIONAL - se muestran placeholders si no existen)
  features: {
    interior: [
      {
        title: "Panel Digital",
        description: "Pantalla táctil de 10 pulgadas",
        image: "/storage/features/panel.jpg"
      }
    ],
    exterior: [
      {
        title: "Luces LED",
        description: "Mayor visibilidad nocturna",
        image: "/storage/features/lights.jpg"
      }
    ],
    performance: [
      {
        title: "Motor Potente",
        description: "Optimizado para carga pesada"
      }
    ],
    seguridad: [
      {
        title: "Frenos ABS",
        description: "Mayor control en frenado"
      }
    ]
  }
}
```

---

## 🎨 Características Implementadas

### ✅ Hero Section
- Galería de imágenes con thumbnails clickeables
- Zoom en imágenes (modal fullscreen)
- Soporte para videos
- Información del producto
- Características técnicas destacadas con iconos
- Botón de descarga de ficha técnica
- Botón de cotización por WhatsApp

### ✅ Sección de Colores
- Selector visual de colores
- Imagen del vehículo que representa el color seleccionado
- Nota sobre calibración de pantalla

### ✅ Características (Tabs)
- **INTERIOR**: Grid de características con imágenes
- **EXTERIOR**: Características externas
- **PERFORMANCE**: Lista de especificaciones de rendimiento
- **SEGURIDAD**: Características de seguridad
- **GALERÍA**: Grid de todas las imágenes

### ✅ Selección de Variante
- Botones para seleccionar versión
- Precio dinámico según variante
- Indicador de stock con barra de progreso
- Selector de cantidad
- Botón "Añadir al carrito"

---

## 🔧 Modificaciones en el Backend (Recomendadas)

Para aprovechar al máximo estos componentes, considera agregar estos campos a tu modelo `Product`:

### Migración Sugerida:

```php
// database/migrations/xxxx_add_vehicle_fields_to_products.php
Schema::table('products', function (Blueprint $table) {
    $table->json('specifications')->nullable();
    $table->json('colors')->nullable();
    $table->json('features')->nullable();
    $table->string('technical_sheet_url')->nullable();
});
```

### Ejemplo de Uso en el Modelo:

```php
// app/Models/Product.php
protected $casts = [
    'specifications' => 'array',
    'colors' => 'array',
    'features' => 'array',
];

// Accessor para valores por defecto
public function getSpecificationsAttribute($value)
{
    return $value ? json_decode($value, true) : [
        'motor' => 'N/A',
        'potencia' => 'N/A',
        'combustible' => 'N/A',
        'transmision' => 'N/A',
        'cabina' => 'N/A',
        'capacidad_carga' => 'N/A',
    ];
}
```

---

## 🎨 Personalización de Colores

Los componentes usan los colores definidos en `tailwind.config.js`:

```javascript
colors: {
    darkGray: '#231f20',      // Texto principal
    grayCustom: '#939191',    // Texto secundario
    turquoise: '#01a387',     // Color primario (botones, highlights)
    darkTurquoise: '#165a4e', // Hover states
}
```

Puedes modificar estos colores en el archivo de configuración de Tailwind.

---

## 📱 Responsive Design

Todos los componentes son totalmente responsive:

- **Mobile**: Layout de 1 columna, galería compacta
- **Tablet**: Grid de 2 columnas en algunas secciones
- **Desktop**: Layout completo con 2 columnas, sticky sidebar

---

## 🔄 Diferencias con Showcontent.jsx Original

| Característica | Original | VehicleShowcase |
|----------------|----------|-----------------|
| Galería | Simple con zoom hover | Thumbnails + modal fullscreen |
| Especificaciones | No incluidas | Tabs con 5 secciones |
| Colores | No incluido | Selector visual de colores |
| Features destacados | No incluidos | Grid con iconos |
| Ficha técnica | No incluida | Botón de descarga |
| Layout | 2 columnas básico | Multi-sección con backgrounds |
| WhatsApp | Botón básico | Botón de cotización destacado |

---

## 🐛 Troubleshooting

### Las imágenes no se muestran
- Verifica que `product.multimedia` esté cargado con `->load(['multimedia'])`
- Asegúrate de que las URLs sean absolutas o relativas correctas

### Los tabs no funcionan
- Verifica que estés usando React 18+
- Asegúrate de que no haya conflictos con otros estados

### Los colores no se ven
- Si `product.colors` es `null`, se usarán 3 colores por defecto
- Para ocultar la sección, puedes modificar la condición en VehicleShowcase.jsx línea 157

### El carrito no funciona
- Verifica que `CartContext` esté correctamente configurado
- Asegúrate de que las rutas del carrito estén funcionando

---

## 📝 TODOs Futuros (Opcional)

- [ ] Agregar animaciones con Framer Motion
- [ ] Implementar comparador de variantes
- [ ] Agregar sección de productos relacionados
- [ ] Implementar carousel en la sección de colores
- [ ] Agregar vista 360° del vehículo
- [ ] Implementar calculadora de financiamiento
- [ ] Agregar reviews/testimonios de clientes

---

## 📞 Soporte

Si tienes dudas o encuentras bugs, revisa:
1. La consola del navegador para errores de JavaScript
2. Los datos que llegan desde el backend (React DevTools)
3. Los estilos aplicados (inspeccionar elemento)

---

**Creado para**: E-commerce Pragati
**Basado en**: Diseño Foton Nibol Aumark S
**Fecha**: Enero 2026