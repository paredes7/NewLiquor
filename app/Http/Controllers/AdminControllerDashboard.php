<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Str;

class AdminControllerDashboard extends Controller
{
    /** 
     * Página principal del panel admin con categorías (Inertia)
     */
 public function index(Request $request)
{
    $perPage = $request->integer('perPage', 4);
    $search = $request->string('search', '');

    $categories = Category::select('id', 'name', 'slug', 'description')
        ->withCount('products')
        ->when($search, function($query, $search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        })
        ->paginate($perPage)
        ->onEachSide(1);

    return Inertia::render('Admin/AdminDashboard', [
        'categories' => $categories,
        'filters'    => ['search' => $search], // Opcional: para mantener el valor en React
    ]);
}

    /**
     * Crear una nueva categoría (AJAX)
     */
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:500',
        ]);

        $category = Category::create([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json([
            'success'  => true,
            'category' => $category
        ]);
    }

    /**
     * Eliminar múltiples categorías
     */
    public function bulkDeleteCategories(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:categories,id',
        ]);

        Category::whereIn('id', $request->ids)->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Actualizar una categoría
     */
    public function updateCategory(Request $request, Category $category)
    {
        $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:500',
        ]);

        $category->update([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json([
            'success'  => true,
            'category' => $category
        ]);
    }

    /**
     * Paginación vía AJAX (React)
     */
  public function paginateCategories(Request $request)
{
    $perPage = $request->integer('perPage', 4);
    $search  = $request->string('search', '');

    $categories = Category::select('id', 'name', 'slug', 'description')
        ->withCount('products')
        ->when($search, function($query, $search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        })
        ->paginate($perPage)
        ->onEachSide(1);

    return response()->json($categories);
}
}
