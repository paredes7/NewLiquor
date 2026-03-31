<?php

namespace App\Http\Resources;

use App\Models\FeaturedProduct;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Resources\Json\JsonResource;

class FeaturedProductResource extends JsonResource
{
    public function toArray($request)
    {
        // 1. NORMALIZACIÓN TOTAL
        // Si el recurso es una variante (lo que pasa en la tienda/filtros)
        if ($this->resource instanceof ProductVariant) {
            $variant = $this->resource;
            $product = $this->product; // Relación cargada en el controlador
        } 
        // Si el recurso es un producto destacado (lo que pasa en el Welcome)
        elseif ($this->resource instanceof FeaturedProduct) {
            $product = $this->product;
            $variant = $this->variant ?? $product->variants->first();
        } 
        // Si el recurso es el producto padre
        else {
            $product = $this->resource;
            $variant = $product->variants->first();
        }

        // 2. EXTRACCIÓN SEGURA DE LA IMAGEN
        // Prioridad: Multimedia de la variante -> Multimedia del producto -> Placeholder
        $mainImage = $variant?->multimedia?->first()?->url 
            ?? $product?->multimedia?->first()?->url 
            ?? "https://via.placeholder.com/600x800";

        return [
            'id'                  => $product->id ?? $this->id,
            'variant_id'          => $variant?->id,
            'category'            => $product->category->name ?? "General",
            'name'                => $product->name ?? "Sin nombre",
            'brand'               => $product->brand ?? "Bodega",
            'alcohol_content'     => $product->alcohol_content ?? "40",
            
            // Datos de la botella específica
            'price'               => (float) ($variant?->price ?? 0),
            'stock'               => (int) ($variant?->stock ?? 0),
            'volume'              => $variant?->volume ?? 'N/A',
            'sku'                 => $variant?->sku ?? 'S/S',
            
            // LA IMAGEN CLAVE
            'main_image'          => $mainImage,

            // Atributo para compatibilidad con ProductCard.jsx
            'product' => [
                'name' => $product->name ?? '',
                'brand' => $product->brand ?? '',
                'category' => $product->category->name ?? 'General',
                'alcohol_content' => $product->alcohol_content ?? '40',
                'multimedia' => $product->multimedia ?? [],
            ],

            // Lista de otras presentaciones (por si el usuario quiere cambiar de tamaño)
            'variants' => $product && $product->relationLoaded('variants') 
                ? $product->variants->map(fn($v) => [
                    'id'    => $v->id,
                    'volume'=> $v->volume,
                    'price' => (float) $v->price,
                    'image' => $v->multimedia->first()?->url ?? $mainImage,
                ]) : []
        ];
    }
}