# Guía de Integración con Base de Datos - Vehicle Showcase

## ✅ Cambios Realizados

### 1. **ProductController.php** - Actualizado para traer datos de BD

El controlador ahora trae todos los datos necesarios:

```php
public function show($slug, $id)
{
    $product = Product::where('available', 1)
        ->with([
            'variants.values.attribute',
            'multimedia.multimediaType',
            'caracteristicas'
        ])
        ->findOrFail($id);

    return Inertia::render('Products/ShowVehicle', [
        'product' => [
            // ... datos del producto
            'specifications' => [
                'motor' => $product->motor,
                'potencia' => $product->potencia,
                'transmision' => $product->transmision,
                'peso' => $product->peso
            ],
            'caracteristicas' => $product->caracteristicas,
            'multimedia' => // incluye multimedia_type_id
        ]
    ]);
}
```

---

## 📊 Estructura de Datos de la BD

### Tabla: `products`
- `motor` - varchar(100) - Motor del vehículo
- `potencia` - varchar(50) - Potencia/Torque
- `transmision` - varchar(50) - Tipo de transmisión
- `peso` - varchar(256) - Peso del vehículo

### Tabla: `caracteristicas`
- `product_id` - int - FK a products
- `nombre` - varchar(100) - Nombre de la característica
- `valor` - varchar(255) - Valor de la característica

### Tabla: `multimedia_type`
IDs y sus significados:
- **1** = General (Hero/Galería principal)
- **2** = Galería (Tab Galería)
- **3** = Interior (Tab Interior)
- **4** = Exterior (Tab Exterior)
- **5** = Performance (Tab Performance)
- **6** = Seguridad (Tab Seguridad)

### Tabla: `product_multimedia`
- `product_id` - int - FK a products
- `multimedia_type_id` - int - FK a multimedia_type
- `url` - varchar(255) - URL de la imagen/video
- `type` - enum('image','video')
- `sort_order` - int - Orden de visualización

---

## 🎨 Componentes y su Función

### 1. **VehicleShowcase.jsx** (Principal)
- Renderiza toda la página del vehículo
- Pasa datos a los componentes hijos
- **CAMBIO**: Se quitó la sección "SELECCIONA TU VERSIÓN"

### 2. **EnhancedGallery.jsx** (Hero Gallery)
- Muestra imágenes con `multimedia_type_id = 1` (General)
- Thumbnails clickeables
- Zoom fullscreen

### 3. **FeatureHighlights.jsx** (Iconos de especificaciones)
- Muestra 4 especificaciones principales:
  - Motor
  - Potencia/Torque
  - Transmisión
  - Peso

**Datos de:** `product.specifications` (tabla `products`)

### 4. **TechnicalSpecificationsTable.jsx** (Tabla de características)
- Muestra tabla con nombre-valor
- Diseño: fondo alternado blanco/gris

**Datos de:** `product.caracteristicas` (tabla `caracteristicas`)

### 5. **SpecificationsSection.jsx** (Tabs)
- **Interior Tab**: Imágenes con `multimedia_type_id = 3`
- **Exterior Tab**: Imágenes con `multimedia_type_id = 4`
- **Performance Tab**: Imágenes con `multimedia_type_id = 5`
- **Seguridad Tab**: Imágenes con `multimedia_type_id = 6`
- **Galería Tab**: Imágenes con `multimedia_type_id = 2`

**Datos de:** `product.multimedia` (tabla `product_multimedia`)

---

## 📝 Cómo Insertar Datos de Ejemplo

### 1. Insertar Producto Base

```sql
INSERT INTO products (category_id, name, description, available, motor, potencia, transmision, peso)
VALUES (
    1,
    'Aumark S | 3 Ton Furgón',
    'El Aumark S es el mejor compañero para tu negocio...',
    1,
    '2TZH',
    '155hp / 240Nm',
    'Manual 5G32',
    '3000'
);
```

### 2. Insertar Características Técnicas

```sql
INSERT INTO caracteristicas (product_id, nombre, valor) VALUES
(1, 'Combustible', 'Gasolina'),
(1, 'Cabina', 'Extendida con AC y Calefacción'),
(1, 'Capacidad de Carga', '3,000 Kgs.'),
(1, 'Frenos', 'ABS'),
(1, 'Airbags', 'Dual (conductor y pasajero)'),
(1, 'Sistema de Control', 'Control de Estabilidad'),
(1, 'Cinturones', '3 puntos en todas las plazas');
```

### 3. Insertar Multimedia (Ejemplos)

```sql
-- Imagen principal (General - aparece en Hero)
INSERT INTO product_multimedia (product_id, multimedia_type_id, url, type, sort_order)
VALUES (1, 1, '/storage/vehicles/aumark/main.jpg', 'image', 1);

-- Más imágenes generales
INSERT INTO product_multimedia (product_id, multimedia_type_id, url, type, sort_order)
VALUES (1, 1, '/storage/vehicles/aumark/side.jpg', 'image', 2);

-- Imágenes de Interior (Tab Interior)
INSERT INTO product_multimedia (product_id, multimedia_type_id, url, type, sort_order) VALUES
(1, 3, '/storage/vehicles/aumark/interior/panel.jpg', 'image', 1),
(1, 3, '/storage/vehicles/aumark/interior/seats.jpg', 'image', 2),
(1, 3, '/storage/vehicles/aumark/interior/ac.jpg', 'image', 3);

-- Imágenes de Exterior (Tab Exterior)
INSERT INTO product_multimedia (product_id, multimedia_type_id, url, type, sort_order) VALUES
(1, 4, '/storage/vehicles/aumark/exterior/front.jpg', 'image', 1),
(1, 4, '/storage/vehicles/aumark/exterior/back.jpg', 'image', 2),
(1, 4, '/storage/vehicles/aumark/exterior/lights.jpg', 'image', 3);

-- Imágenes de Performance (Tab Performance)
INSERT INTO product_multimedia (product_id, multimedia_type_id, url, type, sort_order) VALUES
(1, 5, '/storage/vehicles/aumark/performance/motor.jpg', 'image', 1),
(1, 5, '/storage/vehicles/aumark/performance/suspension.jpg', 'image', 2);

-- Imágenes de Seguridad (Tab Seguridad)
INSERT INTO product_multimedia (product_id, multimedia_type_id, url, type, sort_order) VALUES
(1, 6, '/storage/vehicles/aumark/seguridad/abs.jpg', 'image', 1),
(1, 6, '/storage/vehicles/aumark/seguridad/airbags.jpg', 'image', 2);

-- Galería adicional (Tab Galería)
INSERT INTO product_multimedia (product_id, multimedia_type_id, url, type, sort_order) VALUES
(1, 2, '/storage/vehicles/aumark/gallery/img1.jpg', 'image', 1),
(1, 2, '/storage/vehicles/aumark/gallery/img2.jpg', 'image', 2),
(1, 2, '/storage/vehicles/aumark/gallery/img3.jpg', 'image', 3);
```

---

## 🧪 Cómo Probar

### 1. Verifica que tienes datos en la BD

```sql
-- Ver productos
SELECT * FROM products WHERE available = 1;

-- Ver características de un producto
SELECT * FROM caracteristicas WHERE product_id = 1;

-- Ver multimedia de un producto
SELECT pm.*, mt.name as tipo
FROM product_multimedia pm
LEFT JOIN multimedia_type mt ON pm.multimedia_type_id = mt.id
WHERE pm.product_id = 1;
```

### 2. Visita la URL del producto

```
http://localhost:8000/products/aumark-s-3-ton-furgon/1
```

### 3. Verifica que se muestran:

✅ **Hero Section:**
- Galería con imágenes de tipo "General" (multimedia_type_id = 1)
- Nombre y descripción del producto
- 4 iconos con especificaciones (Motor, Potencia, Transmisión, Peso)

✅ **Tabla de Características:**
- Lista de características de la tabla `caracteristicas`
- Diseño con fondo alternado

✅ **Tabs de Características:**
- **Interior**: Imágenes con multimedia_type_id = 3
- **Exterior**: Imágenes con multimedia_type_id = 4
- **Performance**: Imágenes con multimedia_type_id = 5
- **Seguridad**: Imágenes con multimedia_type_id = 6
- **Galería**: Imágenes con multimedia_type_id = 2

---

## 🐛 Troubleshooting

### No se ven las imágenes en los tabs

**Problema**: Los tabs muestran "No hay imágenes disponibles"

**Solución**: Verifica que las imágenes tienen el `multimedia_type_id` correcto:

```sql
-- Ver qué multimedia_type_id tiene cada imagen
SELECT id, url, multimedia_type_id FROM product_multimedia WHERE product_id = 1;

-- Actualizar si es necesario
UPDATE product_multimedia SET multimedia_type_id = 3 WHERE id = X; -- Para Interior
UPDATE product_multimedia SET multimedia_type_id = 4 WHERE id = Y; -- Para Exterior
```

### No se ve la tabla de características

**Problema**: No aparece la tabla bajo los iconos

**Solución**: Verifica que hay datos en la tabla `caracteristicas`:

```sql
SELECT * FROM caracteristicas WHERE product_id = 1;
```

Si no hay datos, inserta algunos:

```sql
INSERT INTO caracteristicas (product_id, nombre, valor) VALUES
(1, 'Combustible', 'Gasolina'),
(1, 'Capacidad', '3000 Kg');
```

### Los iconos muestran "N/A"

**Problema**: Los 4 iconos de especificaciones muestran "N/A"

**Solución**: Verifica que el producto tiene datos en las columnas `motor`, `potencia`, `transmision`, `peso`:

```sql
SELECT motor, potencia, transmision, peso FROM products WHERE id = 1;
```

Si están vacíos, actualiza:

```sql
UPDATE products SET
    motor = '2TZH',
    potencia = '155hp / 240Nm',
    transmision = 'Manual 5G32',
    peso = '3000'
WHERE id = 1;
```

---

## 📋 Checklist de Verificación

Antes de considerar que todo funciona, verifica:

- [ ] El producto tiene `motor`, `potencia`, `transmision`, `peso` en la BD
- [ ] Hay registros en la tabla `caracteristicas` para el producto
- [ ] Hay al menos 1 imagen con `multimedia_type_id = 1` (General)
- [ ] Hay imágenes para cada tab que quieras mostrar (2-6)
- [ ] Las URLs de las imágenes son accesibles
- [ ] El controlador renderiza `Products/ShowVehicle`
- [ ] `npm run dev` está corriendo
- [ ] `php artisan serve` está corriendo

---

## 🎯 Diferencias con la Versión Anterior

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Galería** | Todas las imágenes | Solo multimedia_type_id = 1 |
| **Especificaciones** | Datos hardcodeados | Desde tabla `products` |
| **Características** | No existía | Tabla desde BD (`caracteristicas`) |
| **Tabs** | Placeholders | Imágenes desde BD por tipo |
| **Versión/Variantes** | Sección completa | Eliminada |
| **Colores** | Selector visible | Oculto (no hay datos) |

---

**Última actualización**: Enero 2026
**Autor**: Claude Code
**Base de datos**: MySQL/MariaDB
