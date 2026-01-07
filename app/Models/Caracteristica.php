<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caracteristica extends Model
{
    protected $fillable = [
        'product_id',
        'nombre',
        'valor'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}