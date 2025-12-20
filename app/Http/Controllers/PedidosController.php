<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use Cart;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderConfirmation;

class PedidosController extends Controller
{
    public function index()
    {
        return Inertia::render('checkout');
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'required|email|max:255',
            'payment_method' => 'required|integer',
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric|min:0',
            'cart.*.sku' => 'required|string|max:100',
            'cart.*.subtotal' => 'required|numeric|min:0',
            'cart.*.name' => 'nullable|string|max:255',
            'cart.*.size' => 'nullable|string|max:255',
            'status' => 'required|integer',
            'total' => 'required|numeric|min:0',
        ]);

        try {
          
            $order = Order::create([
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_email' => $request->customer_email,
                'status_id' => $request->status,
                'payment_method_id' => $request->payment_method,
                'total' => $request->total,
            ]);

            
            $orderItems = [];
            foreach ($request->cart as $item) {
                $orderItems[] = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'sku' => $item['sku'],
                    'name' => $item['name'] ?? null,
                    'quantity' => $item['quantity'],
                    'price' => round($item['price'], 2),
                    'subtotal' => round($item['subtotal'], 2),
                ]);
            }

        
                    $itemsForMail = [];
            foreach ($request->cart as $item) {
                $itemsForMail[] = [
                    'name' => $item['name'] ?? 'Producto',
                    'size' => $item['size'] ?? null, //  TALLA (NO BD)
                    'quantity' => $item['quantity'],
                    'price' => round($item['price'], 2),
                    'subtotal' => round($item['subtotal'], 2),
                ];
            }
 try {
            Mail::to($order->customer_email)
    ->send(new \App\Mail\OrderConfirmation($order, $itemsForMail));
        } catch (\Exception $e) {
            Log::error("Error enviando correo al cliente: " . $e->getMessage());
        } 

            Cart::destroy();

                    return response()->json([
                        'success' => true,
                        'order_id' => $order->id,
                    ]);

        } catch (\Exception $e) {
            Log::error("Error creando pedido: ".$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el pedido: '.$e->getMessage()
            ], 500);
        }
    }
}
