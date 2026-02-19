<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
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
        $featuredProducts = FeaturedProduct::active()
            ->with([
                'product.multimedia',
                'product.variants.values.attribute',
                'variant.values.attribute' // <--- Cargamos la variante específica destacada
            ])
            ->get();
        if ($featuredProducts->count() < 6) {
            // si hay menos de 6 productos destacados, rellenamos con productos aleatorios disponibles
            $necesidad = 6 - $featuredProducts->count();
            $existingProductIds = $featuredProducts->pluck('product_id')->toArray();

            // Obtener productos adicionales que no estén ya en los destacados
            $additionalProducts = Product::where('available', 1)
                ->whereNotIn('id', $existingProductIds)
                ->with(['category', 'multimedia', 'variants.values.attribute'])
                ->inRandomOrder()
                ->take($necesidad)
                ->get();

            // Combinar ambos conjuntos
            $featuredProducts = $featuredProducts->concat($additionalProducts);
        }

        return FeaturedProductResource::collection($featuredProducts);
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
        Log::info("--- Nueva Búsqueda: " . $texto . " ---");
        // 1. Buscamos todas las categorías que coincidan con el texto
        $matchedCategories = Category::where('name', 'LIKE', "%{$texto}%")->get();
        
        // 2. FILTRADO ESTRICTO:
        // Si entre lo que encontramos hay subcategorías (tienen parent_id), 
        // nos quedamos SOLO con ellas para no mostrar el padre.
        $subCategories = $matchedCategories->filter(fn($cat) => !is_null($cat->parent_id));
        
        if ($subCategories->isNotEmpty()) {
            Log::info("Entró al IF: Se detectaron subcategorías.");
            // Caso: Buscaste "Vino Tinto" -> Solo obtenemos IDs de las subcategorías encontradas
            $allRelevantIds = $subCategories->pluck('id')->toArray();
        } else {
            Log::info("Entró al IF: Se detectaron categoria.");
            // Caso: Buscaste "Vino" (Padre) -> Obtenemos el ID del padre y sus hijos
            $parentIds = $matchedCategories->pluck('id')->toArray();
            $childIds = Category::whereIn('parent_id', $parentIds)->pluck('id')->toArray();
            $allRelevantIds = array_unique(array_merge($parentIds, $childIds));
        }
        Log::info("Contenido de allRelevantIds2:", $allRelevantIds);

        // 3. Consulta de Productos (Inclusiva con el nombre del producto)
        $products = Product::with(['variants.values', 'multimedia', 'category'])
        ->where(function($q) use ($texto, $allRelevantIds) {
            
            if (!empty($allRelevantIds)) {
                // LÓGICA DE FILTRO DIRECTO:
                // Si el usuario buscó "Vino Tinto" y encontramos su ID (23),
                // traemos TODOS los productos que tengan category_id = 23.
                // Ignoramos el "LIKE" del nombre para que no entren productos de "Vino" (Padre).
                $q->whereIn('category_id', $allRelevantIds);
            } else {
                // LÓGICA DE COINCIDENCIAS (Solo si no es categoría):
                // Si el texto no coincide con ninguna categoría (ej: "Malbec" o "Absolut"),
                // entonces buscamos por nombre o marca.
                $q->where('name', 'LIKE', "%{$texto}%")
                ->orWhere('brand', 'LIKE', "%{$texto}%");
            }
        })
        ->get();
        Log::info("Productos encontrados:", $products->pluck('name')->toArray());
        // 4. Agrupamos para la vista
        $groupedResults = $products->groupBy(function($item) {
            return $item->category->name ?? 'Resultados Generales';
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

        // 1. Base de la Query con Eager Loading
        $queryProducts = Product::with(['variants.values.attribute', 'multimedia'])
            ->where('available', 1);

        // 2. Filtro por búsqueda (Nombre de producto o nombre de variante)
        if ($search) {
            $queryProducts->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhereHas('variants', fn($v) => $v->where('name', 'like', "%$search%"));
            });
        }

        // 3. Filtros dinámicos por Atributos
        foreach ($filters as $key => $value) {
            if ($value) {
                $queryProducts->whereHas('variants.values', function ($q) use ($key, $value) {
                    $q->where('value', $value)
                        ->whereHas('attribute', fn($attrQ) => $attrQ->where('name', $key));
                });
            }
        }


        $paginatedProducts = $queryProducts->paginate($perPage)->withQueryString();

        return $paginatedProducts;
    }

    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $filters = $request->except(['search', 'page']);
        $perPage = 12;

        // Lógica de Categorías
        $categoryQuery = Category::whereNull('parent_id')
            ->when($search, fn($q) => $q->where('name', 'like', "%$search%"));

        $allCategories = $categoryQuery->get()->map(fn($category) => [
            'id' => $category->id,
            'name' => $category->name,
            'description' => $category->description,
            'slug' => $category->slug,
            'image' => $category->image ?? null,
        ]);

        // Lógica de Atributos para el Sidebar
        $filtersData = ProductAttribute::with('values')->get()->map(fn($attribute) => [
            'id' => $attribute->id,
            'name' => $attribute->name,
            'values' => $attribute->values->map(fn($value) => [
                'value' => $value->value,
                'label' => ucfirst($value->value),
            ])->values(),
        ]);

        // Obtener productos filtrados y paginados
        $productCrudo = $this->getFilteredProducts($request, $perPage);
        $product = FeaturedProductResource::collection($productCrudo);

        return Inertia::render('Welcome', [
            'categories'       => $allCategories->forPage(1, $perPage)->values()->all(),
            'search'           => $search,
            'page'             => $productCrudo->currentPage(),
            'hasMore'          => $allCategories->count() > $perPage,
            'filtersData'      => fn() => $filtersData,
            'activeFilters'    => $filters,
            'product'         => $product, // Objeto paginado transformado
            'totalProducts'    => $productCrudo->total(),
            'featuredProducts' => $this->getFeaturedProducts(),
            'eventos'          => $this->getFeaturedEvent()
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
        $page = 1;
        $perPage = 8;

        // Obtener todas las categorías principales
        $allCategories = Category::whereNull('parent_id')
            ->with([
                'children',
                'children.products.variants.values.attribute',
                'children.products.multimedia',
                'products.variants.values.attribute',
                'products.multimedia'
            ])
            ->get()
            ->map(function ($category) use ($search) {
                // Productos de la categoría principal
                $categoryProducts = $category->products()
                    ->where('available', 1)
                    ->when($search, fn($q) => $q->where('name', 'like', "%$search%"))
                    ->with(['variants.values.attribute', 'multimedia'])
                    ->get();

                // Subcategorías con sus productos
                $children = $category->children->map(function ($child) use ($search) {
                    $childProducts = $child->products()
                        ->where('available', 1)
                        ->when($search, fn($q) => $q->where('name', 'like', "%$search%"))
                        ->with(['variants.values.attribute', 'multimedia'])
                        ->get();

                    return [
                        'id' => $child->id,
                        'name' => $child->name,
                        'slug' => $child->slug,
                        'description' => $child->description,
                        'products' => $childProducts,
                    ];
                });

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'products' => $categoryProducts,
                    'children' => $children,
                ];
            });

        // Buscar la categoría seleccionada por slug
        $selectedCategory = $allCategories->firstWhere('slug', $slug);

        // Paginación
        $categories = $allCategories->forPage($page, $perPage)->values()->all();
        $hasMore = $allCategories->count() > $perPage;

        // Retornamos igual que index pero con selectedCategory
        return Inertia::render('Products/CategoriesPage', [
            'categories' => $categories,
            'selectedCategory' => $selectedCategory,
            'search' => $search,    
            'page' => $page,
            'hasMore' => $hasMore,
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

