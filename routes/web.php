<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminControllerDashboard;
use App\Http\Controllers\AdminCategoryProductsController;
use App\Http\Controllers\AdminProductVariantsController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\VentasController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;
use Inertia\Inertia;
 

Route::get('/', [ProductController::class, 'index'])->name('welcome');

Route::get('/Contacto', function () {
        return Inertia::render('Contacto');
    })->name('contacto');

//para clientes
Route::get('/products/{slug}/{product}', [ProductController::class, 'show'])
    ->name('products.show');

//para cliente
Route::get('/products/{slug}', [ProductController::class, 'getCategoryDetails'])->name('products.categoria');
   
Route::get('/ventas/json', [ProductController::class, 'getCategoriasJson'])->name('admin.ventas.json');    

Route::prefix('carrito')->group(function () {
    Route::get('/data', [CartController::class, 'data'])->name('carrito.data');
    Route::post('/add', [CartController::class, 'add'])->name('carrito.add');
    Route::patch('/update/{rowId}', [CartController::class, 'update'])->name('carrito.update');
    Route::delete('/remove/{rowId}', [CartController::class, 'remove'])->name('carrito.remove');
    Route::delete('/clear', [CartController::class, 'clear'])->name('carrito.clear');
});


    Route::get('/checkout', function () {
        return Inertia::render('checkout');
    })->name('checkout');

    // Endpoint para crear pedido
    Route::post('/orders/store', [PedidosController::class, 'store'])->name('orders.store');



Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('admin.login.post');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

    Route::middleware('auth:admin')->group(function () {

        Route::get('/dashboard', [AdminControllerDashboard::class, 'index']);


        Route::get('/ventas/json', [VentasController::class, 'getCategoriasJson'])->name('admin.ventas.json1');
        Route::get('/ventas/search-sku', [VentasController::class, 'searchBySku']);

        // Categorías
        Route::get('/categories/paginate', [AdminControllerDashboard::class, 'paginateCategories']);
        Route::post('/categories',          [AdminControllerDashboard::class, 'storeCategory']);
        Route::put('/categories/{category}', [AdminControllerDashboard::class, 'updateCategory']);
        Route::delete('/categories/bulk-delete', [AdminControllerDashboard::class, 'bulkDeleteCategories']);


   // Mostrar productos de una categoría
Route::get('/categories/{category}/products', [AdminCategoryProductsController::class, 'index'])
    ->name('admin.categories.products');

// Crear producto
Route::post('/products', [AdminCategoryProductsController::class, 'store'])
    ->name('admin.products.store');

// Actualizar producto
Route::put('/products/{product}', [AdminCategoryProductsController::class, 'update'])
    ->name('admin.products.update');

// Eliminar producto
Route::delete('/products/{product}', [AdminCategoryProductsController::class, 'destroy'])
    ->name('admin.products.destroy');

// Eliminar multimedia de un producto
Route::delete('/products/{product}/multimedia/{media}', [AdminCategoryProductsController::class, 'destroyMultimedia'])
    ->name('admin.products.multimedia.destroy');


Route::post('/descontar-stock', [StockController::class, 'descontar'])
    ->name('admin.stock.descontar');

Route::get('/Ventas', [VentasController::class, 'index'])->name('admin.ventas');

// Obtener atributos y variantes de un producto
Route::get('/products/{product}/attributes', [AdminProductVariantsController::class, 'getAttributes'])
    ->name('admin.products.attributes');

//para redirigr a prodcutos de cada card que hay
Route::get('/products/{slug}/{product}', [VentasController::class, 'show'])
    ->name('products.show.admin');


 
// Crear nuevas variantes (POST)
Route::post('/products/{product}/variants', [AdminProductVariantsController::class, 'store'])
    ->name('admin.products.variants.store');

// Actualizar variante existente (PUT)
Route::put('/variants/{variant}', [AdminProductVariantsController::class, 'update'])
    ->name('admin.variants.update');

// Eliminar variante (DELETE)
Route::delete('/variants/{variant}', [AdminProductVariantsController::class, 'destroy'])
    ->name('admin.variants.destroy');


//mostar estados y metodos de pago
Route::get('/orders/meta', [OrderController::class, 'meta']);
        // Ordenes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);
    Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
    
    // Reportes de ventas

//reporte de prodcutso  
Route::get('/productos/pdf', [ReportController::class, 'exportPdfProductos']);

Route::get('/reportes', [ReportController::class, 'ventas']);
Route::get('/reportes/excel', [ReportController::class, 'exportExcel']);
Route::get('/reportes/csv', [ReportController::class, 'exportCsv']);
Route::get('/reportes/pdf', [ReportController::class, 'exportPdf']);






    });
});



Route::get('/auth/google/redirect', [SocialController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [SocialController::class, 'handleGoogleCallback'])->name('google.callback');


require __DIR__.'/auth.php';
