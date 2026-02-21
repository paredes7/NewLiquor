<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'alcohol_content',
        'brand',
        'description',
        'longDescription',
    ];

    protected $casts = [
        'available' => 'boolean',
        // 'peso' => 'decimal:2' // Comentado porque peso puede contener texto
    ];

    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function variants() {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }

    public function caracteristicas()
    {
        return $this->hasMany(Caracteristica::class);
    }

    //funcion para relacionar productos destacados
    public function featuredProduct()
    {
        return $this->hasMany(FeaturedProduct::class);
    }

    //los anuncios asociados a este producto
    public function anuncios():BelongsToMany
    {
        //BelongstoMany porque es una relacion muchos a muchos
        //la tabla intermedia es product_anuncios
        //la llave foranea de esta tabla es product_id
        //la llave foranea de la tabla anuncios es anuncio_id
        //con withTimestamps para que se guarden las fechas de creacion y actualizacion
        return $this->belongsToMany(Anuncio::class, 'product_anuncios', 'product_id', 'anuncio_id')
                    ->withTimestamps();
    }

    

    
}
