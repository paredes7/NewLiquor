<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'sku',
        'product_id',
        'volume',      
        'price',       
        'stock',     
        'available',  
        'image_variant_url' 
    ];

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function values()
    {
        return $this->belongsToMany(
            ProductAttributeValue::class,
            'product_variant_values',
            'variant_id',
            'attribute_value_id'
        );
    }
    
    public function multimedia() {
        // Relación Muchos a Muchos usando la tabla intermedia variant_multimedia
        return $this->belongsToMany(
            ProductMultimedia::class, 
            'variant_multimedia', 
            'variant_id', 
            'multimedia_id'
        );
    }
}
