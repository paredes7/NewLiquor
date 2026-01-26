<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evento extends Model
{
    protected $fillable = [
        'title_principal_event',
        'description_event',
        'image_URL_principal',
        'titulo_secundario',
        'label',
        'texto_principal',
        'description',
        'image_URL_secundario',
        'fecha_inicio',
        'fecha_fin',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
    ];

    /**
     * Obtener los anuncios asociados a este evento (Relación 1:N).
     */
    public function anuncios(): HasMany
    {
        return $this->hasMany(Anuncio::class, 'id_Event');
    }

    /**
     * Scope para obtener solo eventos vigentes según la fecha actual.
     */
    public function scopeActive($query)
    {
        return $query->where('fecha_inicio', '<=', now())
                     ->where(function ($q) {
                         $q->whereNull('fecha_fin')
                           ->orWhere('fecha_fin', '>=', now());
                     });
    }
}