<?php

namespace App\Http\Resources;

use App\Models\FeaturedProduct;
use Illuminate\Http\Resources\Json\JsonResource;

class FeaturedProductResource extends JsonResource
{
    public function toArray($request)
    {
        $product = $this->product ?? $this->resource;
        $selectedVariant = $this->resource instanceof FeaturedProduct
            ? $this->variant
            : null;

        // Lógica para la imagen: Prioridad a la variante, luego al producto padre
        $mainImage = $selectedVariant?->image_variant_url
            ?? $product->multimedia->first()?->url
            ?? "https://via.placeholder.com/600x800";

        return [
            'id'          => $product->id,
            'featured_variant_id' => $selectedVariant?->id,

            'category'    => $product->category->name ?? "No esta asociado a una categoria",

            // Prioridad: Variante > Producto Base
            'name' => $selectedVariant->name ?? $product->name, // Usamos el nombre de la variante si existe
            'description' => $selectedVariant->description ?? $product->description, // Usamos la descripción de la variante si existe

            'price' => (float) ($selectedVariant ? $selectedVariant->price : $product->price),
            'stock' => (int) ($selectedVariant ? $selectedVariant->stock : $product->stock),

            'content_alcohol' => $product->alcohol_content,
          
            'main_image'          => $mainImage,
            'label'       => $this->label ?? null, // Proviene de FeaturedProduct
          
            'multimedia'  => $product->multimedia->map(fn($m) => [
                'id'         => $m->id,
                'url'        => $m->url,
                'type'       => $m->type,
                'sort_order' => $m->sort_order,
            ]),
           
            'variants'    => $product->variants->map(fn($v) => [
                'id'    => $v->id,
                'name'  => $v->name,
                'description' => $v->description,
                'stock' => $v->stock,
                'sku'   => $v->sku,
                'price' => (float) $v->price,
                'values' => $v->values->map(fn($val) => [
                    'attribute' => $val->attribute->name,
                    'value'     => $val->value
                ])
            ]),
        ];
    }
}
