<?php

namespace App\Http\Middleware;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $mainSlugs = ['whisky', 'tequila', 'vino'];
        return [
            ...parent::share($request),
            'categories' => Category::whereNull('parent_id')->get(), // Todos los padres
            
            // Esta es la clave: Traemos como "hijos" de Otros Licores 
            // a cualquier categoría padre que NO esté en el menú principal
            'otrosLicoresData' => Category::whereNull('parent_id')
                ->whereNotIn('slug', $mainSlugs)
                ->get(),

            'allSubCategories' => Category::whereNotNull('parent_id')->get(),

            'NewProducts' => \App\Models\Product::orderBy('created_at', 'desc')
            ->take(7)
            ->get(),
        ];
        
    }
}
