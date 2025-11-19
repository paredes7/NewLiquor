<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
{
    try {
        $categories = Category::with(['products' => function ($query) {
            $query->where('available', 1);
        }])->get();

        return response()->json($categories);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al cargar productos',
            'message' => $e->getMessage()
        ], 500);
    }
}
}
