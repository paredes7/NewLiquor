<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Anuncio extends Model
{
    protected $fillable = [
        'id_Event',
        'name_anuncio',
        'description_anuncio',
        
    ];

    /**
     * El evento al que pertenece este anuncio (Relación inversa 1:N).
     */
    public function evento(): BelongsTo
    {
        return $this->belongsTo(Evento::class, 'id_Event');
    }

    /**
     * Los productos asociados a este anuncio (Relación N:N mediante product_anuncios).
     */
    public function productos(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_anuncios', 'anuncio_id', 'product_id')
                    ->withTimestamps();
    }
}