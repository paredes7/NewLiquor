<?php
//MODELO PARA PRODUCTOS DESTACADOS
//descripcion: productos que se muestran en la pagina principal como destacados
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

class FeaturedProduct extends Model
{
    protected $fillable = [
        'product_id', //id del producto destacado
        'label', //etiqueta que se muestra en el destacado
        'sort_order', //orden en que se muestran
        'starts_at', //fecha de inicio del destacado
        'ends_at', //fecha de fin del destacado
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at'   => 'datetime',
        'sort_order' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    //permite programar productos destacados a futuro y filtrar los que estan activos
    /*Resultado: Solo selecciona los registros donde la fecha de inicio ya pasó o es exactamente ahora.
     Si pones un producto para que inicie mañana, hoy no aparecerá en el carrusel.*/
    public function scopeActive(Builder $query)
    {
        return $query->where('starts_at', '<=', now())
            ->where(function ($q) {
                $q->whereNull('ends_at')
                    ->orWhere('ends_at', '>=', now());
            })
            ->orderBy('sort_order', 'asc');
    }

    //atributo para obtener la url de la imagen del producto destacado
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->product->multimedia->first()?->url
                ?? "https://via.placeholder.com/600x800",
        );
    }
}
