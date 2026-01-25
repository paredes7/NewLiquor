<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FeaturedProductResource extends JsonResource
{
    public function toArray($request)
    {
        $product = $this->product;

        return [
            'id'          => $product->id,
            'name'        => $product->name,
            'description' => $product->description,
            'price'       => (float) $product->price,
            'label'       => $this->label, // Proviene de FeaturedProduct
            'multimedia'  => $product->multimedia->map(fn($m) => [
                'id'         => $m->id,
                'url'        => $m->url,
                'type'       => $m->type,
                'sort_order' => $m->sort_order,
            ]),
            'variants'    => $product->variants->map(fn($v) => [
                'id'    => $v->id,
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
