<?php

namespace App\Http\Controllers;

use App\Models\Category; // Importamos el modelo para que all() y update() funcionen
use Illuminate\Http\Request;
use Inertia\Inertia;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary; // IMPORTANTE
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Muestra la página del catálogo con categorías y productos
     */
    public function index()
    {
        return Inertia::render('Admin/Catalog', [
            'categories' => Category::all(), // El camión que trae todo de la BD
            'products'   => \App\Models\Product::with(['category', 'variants', 'multimedia'])->get()
        ]);
    }

    /**
     * Actualiza una categoría desde el Modal de React
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        // 1. Validar y preparar datos de texto
        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'slug' => \Illuminate\Support\Str::slug($request->name),
        ];

        \Log::info('¿Tiene archivo?: ' . ($request->hasFile('image_file') ? 'SÍ' : 'NO'));

        // 2. Gestión de la imagen con Cloudinary
        if ($request->hasFile('image_file')) {
            try {
                
                $result = cloudinary()->uploadApi()->upload(
                    $request->file('image_file')->getRealPath(),
                    ['folder' => 'categorias_ecommerce']
                );

                
                if (isset($result['secure_url'])) {
                    $data['image'] = $result['secure_url'];
                }
            } catch (\Exception $e) {
                \Log::error('Error de subida: ' . $e->getMessage());
                $data['image'] = $request->image_url;
            }
        } else {
            
            $data['image'] = $request->image_url;
        }

        // 3. Guardar cambios en la base de datos
        $category->update($data);

        return back();
    }

    public function store(Request $request)
    {
        // 1. Preparamos los datos básicos
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id', // Verifica que el padre exista
        ]);
        
        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'parent_id' => $request->parent_id,
            'slug' => \Illuminate\Support\Str::slug($request->name),
        ];

        // 2. Gestión de la imagen (usando la ruta que ya nos funcionó)
        if ($request->hasFile('image_file')) {
            try {
                $result = cloudinary()->uploadApi()->upload(
                    $request->file('image_file')->getRealPath(),
                    ['folder' => 'categorias_ecommerce']
                );

                if (isset($result['secure_url'])) {
                    $data['image'] = $result['secure_url'];
                }
            } catch (\Exception $e) {
                \Log::error('Error al crear categoría: ' . $e->getMessage());
                $data['image'] = $request->image_url;
            }
        } else {
            $data['image'] = $request->image_url;
        }

        // 3. Crear en la base de datos
        Category::create($data);

        return back()->with('message', 'Categoría creada con éxito');
    }
    public function destroy($id)
    {
        $category = \App\Models\Category::findOrFail($id);

        try {
            // 1. Si la categoría tiene imagen, la borramos de Cloudinary
            if ($category->image) {
                // Extraemos el public_id de la URL (el nombre del archivo en la nube)
                $pathParts = explode('/', parse_url($category->image, PHP_URL_PATH));
                $fileName = end($pathParts);
                $publicId = "categorias_ecommerce/" . explode('.', $fileName)[0];

                // Usamos la ruta que descubrimos que sí funciona en tu vendor
                cloudinary()->uploadApi()->destroy($publicId);
            }

            // 2. Borramos el registro de la base de datos
            $category->delete();

            return back()->with('message', 'Categoría eliminada correctamente');

        } catch (\Exception $e) {
            \Log::error("Error al eliminar: " . $e->getMessage());
            return back()->withErrors(['error' => 'No se pudo eliminar la imagen de la nube, pero el registro se borró.']);
        }
    }
}