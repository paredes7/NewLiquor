<?php

namespace App\Http\Controllers;

use Inertia\Inertia; 
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
 
class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $page = 1;
        $perPage = 10;

        $query = Category::whereNull('parent_id');
        
        if ($search) {
            $query->where('name', 'like', "%$search%");
        }

        $allCategories = $query->get()->map(function ($category) {
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

        return Inertia::render('Welcome', [
            'categories' => $categories,
            'search' => $search,
            'page' => $page,
            'hasMore' => $hasMore,
        ]);
    }

    public function show($slug, $id)
    {
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
                'multimedia' => $product->multimedia->map(fn ($m) => [
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
}