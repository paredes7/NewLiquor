<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use Cart;
use Illuminate\Support\Facades\Mail;
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
            'user_id' => 'required|exists:users,id',
            'shipping_type' => 'required|in:local,envio',
            'delivery_date' => 'required|date',
            'delivery_time' => 'required|string',
            'address' => 'required|string',
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);

        try {
            // Crear pedido
            $order = Order::create([
    'user_id' => $request->user_id,
    'status_id' => 1,
    'payment_method_id' => $request->payment_method_id ?? 1,
    'total' => $request->total,
    'note' => $request->shipping_type === 'envio' ? $request->address : 'Recojo en el local',
    'delivery_date' => $request->delivery_date,   // agregado
    'delivery_time' => $request->delivery_time,   // agregado
]);

            // Crear items
            $orderItems = [];
            foreach ($request->cart as $item) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => round($item['price'], 2),
                    'subtotal' => round($item['quantity'] * $item['price'], 2),
                ]);
                $orderItems[] = $orderItem;
            }

            // Enviar correo al usuario
            $user = $order->user;
            Mail::to($user->email)->send(new OrderConfirmation($order, $orderItems));

            // Vaciar carrito
            Cart::destroy();

            // Redirigir a página de éxito
            return redirect()->route('welcome')->with('success', 'Tu pedido se realizó con éxito!');

        } catch (\Exception $e) {
            return redirect()->route('checkout')->with('error', 'Error al crear el pedido: ' . $e->getMessage());
        }
    }




    
}
