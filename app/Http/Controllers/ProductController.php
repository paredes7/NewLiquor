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
            ->with(['product.variants.values.attribute', 'product.multimedia'])
            ->get();
        return FeaturedProductResource::collection($featuredProducts);
    }

    public function index(Request $request)
    {
        // 1. Recoger parámetros
        $search = $request->query('search', '');
        $filters = $request->except(['search', 'page']);
        // $offset = (int) $request->query('page', 0);
        $page = 1; //desde aqui se controla la paginacion
        $perPage = 12; //desde aqui se controla cuantos productos se ven por pagina

        // 2. QUERY DE PRODUCTOS (Aquí es donde aplicamos los filtros)
        $queryProducts = Product::with(['variants.values.attribute', 'multimedia'])
            ->where('available', 1);

        // Filtro por búsqueda
        if ($search) {
            $queryProducts->where('name', 'like', "%$search%");
        }

        foreach ($filters as $key => $value) {
            if ($value) {
                $queryProducts->whereHas('variants.values', function ($q) use ($key, $value) {
                    $q->where('value', $value)
                        ->whereHas('attribute', function ($attrQ) use ($key) {
                            $attrQ->where('name', $key);
                        });
                });
            }
        }

        //cantidad productos
        $totalProducts = $queryProducts->count();

        //obtener del pedazo actual
        // $products = $queryProducts->skip($offset)->take($perPage)->get();
        // $hasMoreProducts = $totalProducts > ($offset + $perPage); // Verifica si hay más productos para cargar

        $paginatedProducts = $queryProducts->paginate($perPage)->withQueryString();
        // 3. QUERY DE CATEGORÍAS (Limpia)
        $categoryQuery = Category::whereNull('parent_id');
        if ($search) {
            $categoryQuery->where('name', 'like', "%$search%");
        }

        $allCategories = $categoryQuery->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'slug' => $category->slug,
                'image' => $category->image ?? null,
            ];
        });

        $categories = $allCategories->forPage($page, $perPage)->values()->all();
        $hasMore = $allCategories->count() > $perPage;

        //filtros
        // Traemos atributos con sus valores
        $attributes = ProductAttribute::with('values')->get();

        // Transformamos para React

        // 4. OBTENER ATRIBUTOS PARA LOS FILTROS DEL SIDEBAR
        $filtersData = $attributes->map(function ($attribute) {
            return [
                'id' => $attribute->id,
                'name' => $attribute->name, // React usará 'name' como label
                'values' => $attribute->values->map(function ($value) {
                    return [
                        'value' => $value->value,      // lo que se guardará
                        'label' => ucfirst($value->value), // lo que se muestra
                    ];
                })->values(),
            ];
        });

        //para cargar las imagenes de los productos en la vista welcome
        //  $productsMultimedia = Product::with(['multimedia', 'variants.values'])->get();

        return Inertia::render('Welcome', [
            'categories' => fn() => $categories, //como funciona fn() lazy: se ejecuta solo cuando react lo pide
            'search' => $search,
            'page' => $page,
            'hasMore' => $hasMore,
            'filtersData' => fn() => $filtersData,
            'activeFilters' => $filters,
            'products' => $paginatedProducts,
            'totalProducts' => $totalProducts,
            'featuredProducts' => $this->getFeaturedProducts(),
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
