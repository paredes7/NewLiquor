<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Cloudinary\Api\Upload\UploadApi;

class AdminCategoryProductsController extends Controller
{
    // Mostrar productos de una categoría (ya lo tienes)
    public function index($categoryId)
    {
        $category = Category::select('id', 'name', 'description')->findOrFail($categoryId);

        $products = Product::where('category_id', $categoryId)
            ->select('id', 'name', 'description', 'price', 'stock', 'image')
            ->paginate(6)
            ->onEachSide(1);

        return Inertia::render('Admin/CategoryProducts', [
            'category' => $category,
            'products' => $products
        ]);
    }

    // Guardar un producto nuevo
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|image|max:5120', // 5MB
        ]);

        $data = $request->only('category_id', 'name', 'description', 'price', 'stock');

        if ($request->hasFile('image')) {
            $uploadApi = new UploadApi();
            $uploaded = $uploadApi->upload($request->file('image')->getRealPath(), [
                'folder' => "products/{$request->category_id}",
            ]);
            $data['image'] = $uploaded['secure_url'] ?? null;
        }

        $product = Product::create($data);

        return response()->json(['status' => 'success', 'product' => $product]);
    }

    // Actualizar un producto existente
   public function update(Request $request, Product $product)
{
   
    $request->validate([
        'name'        => 'required|string|max:255',
        'description' => 'nullable|string',
        'price'       => 'required|numeric|min:0',
        'stock'       => 'required|integer|min:0',
        'image'       => 'nullable|image|max:5120',
    ]);

    $data = $request->only('name', 'description', 'price', 'stock');

    if ($request->hasFile('image')) {
        $uploadApi = new UploadApi();
        $uploaded = $uploadApi->upload($request->file('image')->getRealPath(), [
            'folder' => "products/{$product->category_id}",
        ]);
        $data['image'] = $uploaded['secure_url'] ?? null;
    }

    $product->update($data);

    return response()->json(['status' => 'success', 'product' => $product]);
}

    // Eliminar un producto
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['status' => 'success']);
    }
}
