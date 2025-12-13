<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderDeliveredAdmin;
use App\Mail\OrderDeliveredCustomer;

class OrderController extends Controller
{
    /**
     * Listar todas las órdenes (JSON)
     */
    public function index(Request $request)
    {
        $query = Order::with(['status', 'paymentMethod']); // quitar 'user'

        // BÚSQUEDA REAL AGRUPADA
        if ($request->search) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('id', 'LIKE', "%$search%")
                  ->orWhere('customer_name', 'LIKE', "%$search%")
                  ->orWhere('customer_phone', 'LIKE', "%$search%");
            });
        }

        // PAGINACIÓN REAL
        $orders = $query->orderByDesc('id')->paginate(7);

        return response()->json($orders);
    }

    /**
     * Mostrar detalle de una orden (JSON)
     */
  public function show(Order $order)
{
    $order->load([
        'status',
        'paymentMethod',
        'items.product.variants.values.attribute', // cargar variantes + valores + nombre del atributo
        'items.product.multimedia',               // cargar imagen del producto
    ]);

    // Mapear items para incluir valores de variantes con nombre del atributo
    $order->items->transform(function ($item) {
        $variant = $item->product->variants->firstWhere('sku', $item->sku);

        if ($variant) {
            // Combinar nombre del atributo + valor, ej: "Talla: 40, Color: Rojo"
            $variant_values = $variant->values->map(function($v) {
                return $v->attribute->name . ': ' . $v->value;
            })->implode(', ');

            $item->variant_value = $variant_values;
            $item->variant_price = $variant->price;
            $item->variant_multimedia = $variant->multimedia ?? []; // si tienes multimedia de la variante
        } else {
            $item->variant_value = $item->sku;
            $item->variant_price = $item->price;
            $item->variant_multimedia = [];
        }

        return $item;
    });

    return response()->json($order);
}
    /**
     * Actualizar una orden (JSON)
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status_id'         => 'required|exists:order_statuses,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'total'             => 'required|numeric|min:0',
            'note'              => 'nullable|string|max:500',
            'delivery_date'     => 'nullable|date',
            'delivery_time'     => 'nullable|string|max:10',
        ]);

        $previousStatus = $order->status_id;

        // Actualizar orden
        $order->update($request->only([
            'status_id', 'payment_method_id', 'total', 'note', 'delivery_date', 'delivery_time'
        ]));

        // Descontar stock si pasa a Completado (id=3) y antes no estaba completado
        // Ahora asumimos que stock se maneja a nivel de variantes o disponible, así que este bloque podría ajustarse según tu lógica
        if ($order->status_id == 3 && $previousStatus != 3) {
            foreach ($order->items as $item) {
                $product = $item->product;
                // Si quieres manejar stock, debes agregar campo 'stock' o actualizar variantes aquí
                if(property_exists($product, 'stock')) {
                    $product->stock = max(0, $product->stock - $item->quantity);
                    $product->save();
                }
            }
        }

        // Enviar correos si pasa a Entregado (id=4) y antes no estaba entregado
        if ($order->status_id == 4 && $previousStatus != 4) {
            Mail::to('jhasesaat@gmail.com')->send(new OrderDeliveredAdmin($order));

            if (!empty($order->customer_email)) {
                Mail::to($order->customer_email)->send(new OrderDeliveredCustomer($order));
            }
        }

        return response()->json([
            'success' => true,
            'order'   => $order,
        ]);
    }

    /**
     * Eliminar una orden (JSON)
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Para ver los estados y métodos de pago
     */
    public function meta()
    {
        $statuses = \App\Models\OrderStatus::all();
        $payments = \App\Models\PaymentMethod::all();

        return response()->json([
            'statuses' => $statuses,
            'payments' => $payments,
        ]);
    }
}
