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
        $texto = $request->input('search'); // Captura "arroz"

        return Inertia::render('ResultPage', [
            'search' => $texto,
            'products' => [] // Por ahora enviamos vacío
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
}
