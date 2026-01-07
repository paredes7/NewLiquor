<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'longDescription',
        'available',
        'motor',
        'potencia',
        'transmision',
        'peso'
    ];

    protected $casts = [
        'available' => 'boolean',
        // 'peso' => 'decimal:2' // Comentado porque peso puede contener texto
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function multimedia()
    {
        return $this->hasMany(ProductMultimedia::class);
    }

    public function caracteristicas()
    {
        return $this->hasMany(Caracteristica::class);
    }
}
