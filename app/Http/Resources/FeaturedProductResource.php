<?php

namespace App\Http\Resources;

use App\Models\FeaturedProduct;
use Illuminate\Http\Resources\Json\JsonResource;

class FeaturedProductResource extends JsonResource
{
    public function toArray($request)
    {
        // 1. Identificamos si estamos tratando con un FeaturedProduct o un Product directamente
        $product = $this->product ?? $this->resource;
        
        // 2. Seleccionamos la variante: La específica del destacado, o la primera del producto
        $selectedVariant = ($this->resource instanceof FeaturedProduct && $this->product_variant_id)
            ? $this->variant 
            : $product->variants->first();

        // 3. Lógica para la imagen: Ahora viene de la relación multimedia de la variante
        // Evitamos el error "first() on null" verificando relaciones
        $mainImage = $selectedVariant?->multimedia?->first()?->url 
            ?? "https://via.placeholder.com/600x800";

        return [
            'id'                  => $product->id,
            'featured_variant_id' => $selectedVariant?->id,
            'category'            => $product->category->name ?? "General",
            'name'                => $product->name,
            'brand'               => $product->brand,
            'content_alcohol'     => $product->alcohol_content,
            
            // Datos de la variante seleccionada
            'price'               => (float) ($selectedVariant?->price ?? 0),
            'stock'               => (int) ($selectedVariant?->stock ?? 0),
            'volume'              => $selectedVariant?->volume ?? 'N/A',
            'sku'                 => $selectedVariant?->sku ?? 'S/S',
            
            'main_image'          => $mainImage,
            'label'               => $this->label ?? null, // Atributo de FeaturedProduct

            // Transformamos todas las variantes para el selector en el frontend
            'variants'            => $product->variants->map(fn($v) => [
                'id'      => $v->id,
                'volume'  => $v->volume,
                'stock'   => $v->stock,
                'sku'     => $v->sku,
                'price'   => (float) $v->price,
                'image'   => $v->multimedia->first()?->url ?? "https://via.placeholder.com/600x800",
            ]),
        ];
    }
}