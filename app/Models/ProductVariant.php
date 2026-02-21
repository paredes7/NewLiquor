<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductVariant extends Model
{
    protected $table = 'product_variants';

    protected $fillable = [
        'sku',
        'product_id',
        'volume',  
        'price',       
        'stock',     
        'available',  
        // Eliminamos 'image_variant_url' porque ahora usas la tabla 'variant_multimedia'
    ];

    protected $casts = [
        'available' => 'boolean',
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    /**
     * Relación inversa con el producto maestro
     */
    public function product(): BelongsTo {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Relación Muchos a Muchos con Atributos (ej: Color, Tamaño)
     */
    public function values(): BelongsToMany
    {
        return $this->belongsToMany(
            ProductAttributeValue::class,
            'product_variant_values',
            'variant_id',
            'attribute_value_id'
        );
    }
    
    /**
     * Relación Muchos a Muchos con Multimedia a través de la tabla intermedia
     */
    public function multimedia(): BelongsToMany {
        return $this->belongsToMany(
            ProductMultimedia::class, 
            'variant_multimedia', 
            'variant_id', 
            'multimedia_id'
        );
    }
}