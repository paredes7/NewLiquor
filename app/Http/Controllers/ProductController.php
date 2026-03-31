<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use App\Models\FeaturedProduct;
use App\Http\Resources\FeaturedProductResource;
use App\Models\Evento;
use App\Http\Resources\EventResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Laravel\Facades\Image;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;


class ProductController extends Controller
{


    /**
     * sirve para obtener los productos destacados y enviarlos a la vista welcome
     * 
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection 
     * AnonymousResourceCollection: Es el nombre técnico de lo que devuelve el método ::collection().
     */
    private function getFeaturedProducts()
    {
        // Traemos las variantes más vendidas (puedes ajustar el número a 6 u 8)
        $topVariants = ProductVariant::with([
                'product.category', 
                'multimedia'
            ])
            ->where('available', 1)  
            ->where('stock', '>', 0) 
            ->orderBy('ventas_totales', 'desc') 
            ->take(8) 
            ->get();

        return FeaturedProductResource::collection($topVariants);
    }


    /**
     * Recupera solo la información básica del evento activo para el banner de inicio
     */
    private function getFeaturedEvent()
    {
        // Buscamos el evento activo más reciente
        $Eventos = Evento::active() // Usando el scope definido en el modelo
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return EventResource::collection($Eventos);
    }


    public function search(Request $request)
    {
        $texto = $request->input('search');

        // --- PARTE 1: Identificación de Categorías ---
        $matchedCategories = Category::where('name', 'LIKE', "%{$texto}%")->get();
        
        // Si buscó una subcategoría (tiene padre), nos enfocamos en ella
        $subCategories = $matchedCategories->filter(fn($cat) => !is_null($cat->parent_id));
        
        if ($subCategories->isNotEmpty()) {
            $allRelevantIds = $subCategories->pluck('id')->toArray();
        } else {
            // Si buscó categoría padre, incluimos a todos sus hijos
            $parentIds = $matchedCategories->pluck('id')->toArray();
            $childIds = Category::whereIn('parent_id', $parentIds)->pluck('id')->toArray();
            $allRelevantIds = array_unique(array_merge($parentIds, $childIds));
        }

        // --- PARTE 2: Búsqueda de Variantes (La tabla product_variants) ---
        $variants = ProductVariant::with(['product.category', 'multimedia'])
            ->where('available', 1)
            ->where(function($q) use ($texto, $allRelevantIds) {
                
                // Prioridad 1 & 2: Categorías y Subcategorías 
                if (!empty($allRelevantIds)) {
                    $q->whereHas('product', function($pq) use ($allRelevantIds) {
                        $pq->whereIn('category_id', $allRelevantIds);
                    });
                } 
                
                // Prioridad 3: Coincidencia por texto (ej: "Black") 
                $q->orWhereHas('product', function($pq) use ($texto) {
                    $pq->where('name', 'LIKE', "%{$texto}%")
                    ->orWhere('brand', 'LIKE', "%{$texto}%");
                })
                ->orWhere('sku', 'LIKE', "%{$texto}%")
                ->orWhere('volume', 'LIKE', "%{$texto}%");
            })
            ->get();

        // --- PARTE 3: Agrupación ---
        $groupedResults = $variants->groupBy(function($variant) {
            // Agrupamos por el nombre de la categoría del producto padre
            return $variant->product->category->name ?? 'General';
        });

        return Inertia::render('ResultPage', [
            'search' => $texto,
            'groupedResults' => $groupedResults 
        ]);
    }

    private function getFilteredProducts(Request $request, $perPage = 12)
    {
        $search = $request->query('search', '');
        $filters = $request->except(['search', 'page']);

        // LOG 1: Ver qué llega en la petición
        \Log::info("--- INICIO DE FILTRADO ---");
        \Log::info("Buscador (search): " . ($search ?: 'vacía'));
        \Log::info("Filtros activos: " . json_encode($filters));

        $query = ProductVariant::with(['product.category', 'multimedia'])
            ->where('available', 1);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('product', function($pq) use ($search) {
                    $pq->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
                })
                ->orWhere('sku', 'like', "%{$search}%")
                ->orWhere('volume', 'like', "%{$search}%");
            });
        }

        foreach ($filters as $key => $value) {
            if (!$value) continue;

            // LOG 2: Ver cada filtro procesado
            \Log::info("Procesando filtro: [$key] con valor: [$value]");

            switch ($key) {
                case 'max_price':
                    if ((float)$value > 0) {
                        $query->where('price', '<=', (float)$value);
                    }
                    break;

                case 'Tipo':
                    $query->whereHas('product.category', function($cq) use ($value) {
                        // LOG 3: Ver qué nombre de categoría busca exactamente
                        \Log::info("SQL -> Buscando categoría con nombre exacto: '$value'");
                        $cq->where('name', $value);
                    });
                    break;

                case 'Marca':
                    $query->whereHas('product', function($pq) use ($value) {
                        $pq->where('brand', $value);
                    });
                    break;

                case 'Tamaño':
                    $query->where('volume', $value);
                    break;
            }
        }

        // LOG 4: Ver la consulta SQL final generada antes de ejecutarla
        \Log::info("SQL FINAL: " . $query->toSql());
        \Log::info("BINDINGS: " . json_encode($query->getBindings()));

        $result = $query->orderBy('id', 'desc')
                        ->paginate($perPage)
                        ->withQueryString();

        \Log::info("Productos encontrados: " . $result->total());
        \Log::info("--- FIN DE FILTRADO ---");
        
        if ($result->count() > 0) {
            \Log::info("=== LISTA DE VARIANTES ENVIADAS AL FRONT ===");
            foreach ($result as $variant) {
                \Log::info(sprintf(
                    "ID Variante: %s | Producto: %s | Marca: %s | Categoría: %s | Precio: %s",
                    $variant->id,
                    $variant->product->name ?? 'N/A',
                    $variant->product->brand ?? 'N/A',
                    $variant->product->category->name ?? 'N/A',
                    $variant->price
                ));
            }
            \Log::info("============================================");
        } else {
            \Log::info("AVISO: La consulta no devolvió ningún producto para estos filtros.");
        }
        return $result;
    }

    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $filters = $request->except(['search', 'page']);
        $perPage = 12;

        $categorias = Category::select('name')
            ->orderBy('name', 'asc')
            ->get()
            ->map(fn($cat) => [
                'value' => $cat->name,
                'label' => mb_strtoupper($cat->name), 
            ]);
       
        $marcas = Product::select('brand')
            ->whereNotNull('brand')
            ->distinct()
            ->orderBy('brand', 'asc')
            ->get()
            ->map(fn($p) => [
                'value' => $p->brand,
                'label' => mb_strtoupper($p->brand),
            ]);

        $tamanos = ProductVariant::select('volume')
            ->whereNotNull('volume')
            ->distinct()
            ->get()
            ->map(fn($v) => [
                'value' => $v->volume,
                'label' => $v->volume,
            ]);

        $filtersData = [
            ['name' => 'Tipo', 'values' => $categorias],
            ['name' => 'Marca', 'values' => $marcas],
            ['name' => 'Tamaño', 'values' => $tamanos],
        ];

        $productCrudo = $this->getFilteredProducts($request, $perPage);

        $product = FeaturedProductResource::collection($productCrudo)->additional([
            'meta' => [
                'total' => $productCrudo->total(),
            ]
        ]);

        $allCategories = Category::whereNull('parent_id')
            ->when($search, fn($q) => $q->where('name', 'like', "%$search%"))
            ->get();

        return Inertia::render('Welcome', [
            'categories'    => $allCategories->values()->all(),
            'search'        => $search,
            'page'          => $productCrudo->currentPage(),
            'filtersData'   => $filtersData,
            'activeFilters' => $filters,
            'product'       => $product, 
            'totalProducts' => $productCrudo->total(),
            'featuredProducts' => $this->getFeaturedProducts(),
            'eventos'       => $this->getFeaturedEvent()
        ]);
    }

    public function show($slug, $id)
    {
        // El slug es solo para SEO, no lo usamos para buscar el producto
        // Esto permite que funcionen tanto URLs antiguas como nuevas
        $product = Product::where('available', 1)
            ->with([
                'variants.values.attribute',
                'multimedia.multimediaType', // Incluir el tipo de multimedia
                'caracteristicas' // Incluir características
            ])
            ->findOrFail($id);

        return Inertia::render('Products/ShowVehicle', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'longDescription' => $product->longDescription,
                'price' => $product->price,

                // Multimedia organizado por tipo
                'multimedia' => $product->multimedia->map(fn($m) => [
                    'id' => $m->id,
                    'url' => $m->url,
                    'type' => $m->type ?? 'image',
                    'multimedia_type_id' => $m->multimedia_type_id,
                    'multimedia_type_name' => $m->multimediaType->name ?? 'General',
                    'sort_order' => $m->sort_order,
                ]),

                // Variantes
                'variants' => $product->variants->map(fn($v) => [
                    'id' => $v->id,
                    'stock' => $v->stock,
                    'sku' => $v->sku,
                    'price' => $v->price,
                    'values' => $v->values->map(fn($val) => [
                        'attribute' => $val->attribute->name,
                        'value' => $val->value
                    ])
                ]),

                // Especificaciones del producto (de la tabla products)
                'specifications' => [
                    'motor' => $product->motor ?? 'N/A',
                    'potencia' => $product->potencia ?? 'N/A',
                    'transmision' => $product->transmision ?? 'N/A',
                    'peso' => $product->peso ?? 'N/A',
                ],

                // Características adicionales (de la tabla caracteristicas)
                'caracteristicas' => $product->caracteristicas->map(fn($c) => [
                    'nombre' => $c->nombre,
                    'valor' => $c->valor
                ])
            ]
        ]);
    }

    public function getCategoriasJson(Request $request)
    {
        $search = $request->query('search', '');
        $offset = (int) $request->query('offset', 0);
        $perPage = 5;

        $query = Category::whereNull('parent_id');

        if ($search) {
            $query->where('name', 'like', "%$search%");
        }

        $allCategories = $query->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'image' => $category->image ?? null,
            ];
        });

        $categories = $allCategories->slice($offset, $perPage)->values()->all();
        $hasMore = $allCategories->count() > $offset + $perPage;

        return response()->json([
            'categories' => $categories,
            'hasMore' => $hasMore,
        ]);
    }

    public function getCategoryDetails(Request $request, $slug)
    {
        $search = $request->query('search', '');
        
        // 1. Cargamos las categorías de forma eficiente
        $allCategories = Category::whereNull('parent_id')
            ->with(['children'])
            ->get()
            ->map(function ($category) use ($search) {
                
                // 2. Traemos VARIANTES directamente (no productos) para la categoría padre
                $categoryVariants = ProductVariant::with(['product', 'multimedia'])
                    ->where('available', 1)
                    ->whereHas('product', function($q) use ($category, $search) {
                        $q->where('category_id', $category->id)
                        ->when($search, fn($sq) => $sq->where('name', 'like', "%$search%"));
                    })->get();

                // 3. Subcategorías con sus VARIANTES
                $children = $category->children->map(function ($child) use ($search) {
                    $childVariants = ProductVariant::with(['product', 'multimedia'])
                        ->where('available', 1)
                        ->whereHas('product', function($q) use ($child, $search) {
                            $q->where('category_id', $child->id)
                            ->when($search, fn($sq) => $sq->where('name', 'like', "%$search%"));
                        })->get();

                    return [
                        'id' => $child->id,
                        'name' => $child->name,
                        'slug' => $child->slug,
                        'description' => $child->description,
                        'products' => $childVariants, // Ahora son variantes listas para ProductCard
                    ];
                });

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image' => $category->image, // Aseguramos que viaje la imagen
                    'products' => $categoryVariants,
                    'children' => $children,
                ];
            });

        $selectedCategory = $allCategories->firstWhere('slug', $slug);

        return Inertia::render('Products/CategoriesPage', [
            'categories' => $allCategories,
            'selectedCategory' => $selectedCategory,
            'search' => $search,
        ]);
    }

    //obtener productos mas destacados de hoy






    /**
     * Vista principal del administrador de productos
     */
    public function adminIndex()
    {
        // Cargamos los productos con la jerarquía completa (Solución B)
        $products = Product::with(['variants.multimedia', 'category'])->get();
        $categories = Category::whereNull('parent_id')->get();

        return Inertia::render('Admin/Inventory/ProductInventory', [ // <--- Nuevo nombre de archivo
            'products' => $products,
            'categories' => $categories
        ]);
    }

    /**
     * Para actualizar el stock o precio rápido desde la Card
     */
    public function updateVariantStock(Request $request, $id)
    {
        $variant = \App\Models\ProductVariant::findOrFail($id);
        $variant->update($request->only(['stock', 'price', 'available']));
        
        return back()->with('message', 'Inventario actualizado');
    }

    public function store(Request $request)
    {
        // Validamos los datos mínimos requeridos para el sistema
        $request->validate([
            'name' => 'required|string|max:200',
            'category_id' => 'required|exists:categories,id',
            'brand' => 'required|string|max:200',
            'alcohol_content' => 'required|string|max:200',
        ]);

        return DB::transaction(function () use ($request) {
            // 1. Crear el Producto (Padre) sin variantes
            $product = Product::create([
                'category_id' => $request->category_id,
                'name' => $request->name,
                'brand' => $request->brand,
                'alcohol_content' => $request->alcohol_content,
                'description' => $request->description, // Puede ser null
                'longDescription' => null, // Forzado a null por ahora
                'slug' => \Illuminate\Support\Str::slug($request->name), // Generación automática
            ]);

            return back()->with('message', 'Producto base creado con éxito. ¡Listo para añadir variantes!');
        });
    }
    public function update(Request $request, $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $product = Product::findOrFail($id);

            // 1. Actualizar datos del Producto (Padre)
            $product->update([
                'category_id' => $request->category_id,
                'name' => $request->name,
                'brand' => $request->brand,
                'alcohol_content' => $request->alcohol_content,
                'description' => $request->description,
                'slug' => \Illuminate\Support\Str::slug($request->name),
            ]);

            // 2. Actualizar Variantes (Hijos)
            foreach ($request->variants as $index => $variantData) {
                $variant = \App\Models\ProductVariant::findOrFail($variantData['id']);
                
                // Si el frontend envió un archivo en este índice
                if ($request->hasFile("variants.{$index}.newFile")) {
                    $file = $request->file("variants.{$index}.newFile");

                    // 1. PROCESAMIENTO: Redimensionar y convertir a WebP (600x600)
                    $img = Image::read($file)
                        ->cover(600, 600)
                        ->encodeByExtension('webp', quality: 75);

                    // 2. ALMACENAMIENTO: Usando la ruta técnica de tu CategoryController
                    try {
                        $base64Image = "data:image/webp;base64," . base64_encode($img);

                        $result = cloudinary()->uploadApi()->upload(
                            $base64Image, 
                            [
                                'folder' => 'catalogo_licores',
                                'format' => 'webp' 
                            ]
                        );

                        if (isset($result['secure_url'])) {
                            // 1. Buscamos la relación en la tabla puente 'variant_multimedia'
                            $pivot = \DB::table('variant_multimedia')
                                ->where('variant_id', $variant->id)
                                ->first();

                            if ($pivot) {
                                // 2. Si existe el vínculo, vamos a 'product_multimedia' y actualizamos la URL
                                \App\Models\ProductMultimedia::where('id', $pivot->multimedia_id)
                                    ->update(['url' => $result['secure_url']]);
                                    
                            } else {
                                // 3. Caso borde: Si la variante no tenía foto antes, creamos el registro inicial
                                $newMultimedia = \App\Models\ProductMultimedia::create([
                                    'url' => $result['secure_url'],
                                    'type' => 'image',
                                    'multimedia_type_id' => 1
                                ]);

                                \DB::table('variant_multimedia')->insert([
                                    'variant_id' => $variant->id,
                                    'multimedia_id' => $newMultimedia->id
                                ]);
                            }

                            // 4. Mantenimiento: También actualizamos el campo directo por si acaso
                            $variant->update(['image_variant_url' => $result['secure_url']]);
                        }
                    } catch (\Exception $e) {
                        \Log::error('Error de subida Cloudinary: ' . $e->getMessage());
                    }
                }

                // Actualizamos precios y stock (convirtiendo coma a punto)
                $variant->update([
                    'price' => str_replace(',', '.', $variantData['price']),
                    'stock' => $variantData['stock']
                ]);
            }
            
            return back()->with('message', 'Producto y variantes actualizados con éxito');
        });
    }

    public function addVariant(Request $request)
    {
        // 1. Validamos los datos (añadimos la validación de la imagen)
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'volume' => 'required|string|max:200',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image_file' => 'nullable|image|max:2048', // Opcional, máximo 2MB
        ]);

        return DB::transaction(function () use ($request) {
            // 2. Generación del SKU correlativo
            $count = \App\Models\ProductVariant::where('product_id', $request->product_id)->count();
            $newSku = "SKU-{$request->product_id}-" . ($count + 1);

            // 3. Creamos la variante
            $variant = \App\Models\ProductVariant::create([
                'product_id' => $request->product_id,
                'volume' => $request->volume,
                'price' => $request->price,
                'stock' => $request->stock,
                'sku' => $newSku,
                'available' => 1
            ]);

            // 4. GESTIÓN DE IMAGEN (Si se seleccionó una foto en el modal)
            if ($request->hasFile('image_file')) {
                try {
                    // A. Procesamiento con Intervention Image (600x600 WebP)
                    $img = \Intervention\Image\Laravel\Facades\Image::read($request->file('image_file'))
                        ->cover(600, 600)
                        ->encodeByExtension('webp', quality: 75);

                    // B. Subida a Cloudinary usando la ruta API que ya te funcionó
                    $result = cloudinary()->uploadApi()->upload(
                        "data:image/webp;base64," . base64_encode($img), 
                        ['folder' => 'catalogo_licores']
                    );

                    if (isset($result['secure_url'])) {
                        // C. Crear el registro en product_multimedia
                        $multimedia = \App\Models\ProductMultimedia::create([
                            'url' => $result['secure_url'],
                            'type' => 'image',
                            'multimedia_type_id' => 1 // Asumiendo 1 para imágenes
                        ]);

                        // D. Vincular en la tabla puente variant_multimedia
                        \DB::table('variant_multimedia')->insert([
                            'variant_id' => $variant->id,
                            'multimedia_id' => $multimedia->id
                        ]);

                        // E. Actualizar el campo directo por compatibilidad
                        $variant->update(['image_variant_url' => $result['secure_url']]);
                    }
                } catch (\Exception $e) {
                    \Log::error('Error al subir imagen de variante: ' . $e->getMessage());
                }
            }

            return back()->with('message', 'Variante e imagen añadidas correctamente');
        });
    }


    public function destroy(Product $product)
    {
        return DB::transaction(function () use ($product) {
            // 1. Obtener todas las variantes del producto para limpiar sus imágenes
            $variants = $product->variants()->with('multimedia')->get();

            foreach ($variants as $variant) {
                foreach ($variant->multimedia as $media) {
                    //Opcional: Borrar de Cloudinary si tienes el public_id
                    $publicId = $this->getPublicIdFromUrl($media->url);
                    cloudinary()->uploadApi()->destroy($publicId);

                    // Borrar registro de la tabla multimedia
                    $media->delete(); 
                }
                // Las relaciones en 'variant_multimedia' se borran solas si usaste cascade en la BD
                $variant->delete();
            }

            // 2. Finalmente, borrar el producto padre
            $product->delete();

            return back()->with('message', 'Producto y todas sus presentaciones eliminados con éxito');
        });
    }

    private function getPublicIdFromUrl($url)
    {
        // Esta lógica extrae el nombre del archivo de la URL de Cloudinary
        $path = parse_url($url, PHP_URL_PATH);
        $segments = explode('/', $path);
        $lastSegment = end($segments);
        return pathinfo($lastSegment, PATHINFO_FILENAME);
    }

    public function destroyVariant(\App\Models\ProductVariant $variant)
    {
        return DB::transaction(function () use ($variant) {
            // 1. Limpiamos las relaciones multimedia de esta variante específica
            foreach ($variant->multimedia as $media) {
                $variant->multimedia()->detach($media->id);
                $media->delete(); 
            }

            // 2. Borrado físico de la variante en MariaDB
            $variant->delete();

            return back()->with('message', 'Presentación eliminada correctamente');
        });
    }
}

