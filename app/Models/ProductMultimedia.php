<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;;
use App\Models\MultimediaType;

class ProductMultimedia extends Model
{
    protected $fillable = [
        'product_id',
        'multimedia_type_id',
        'url',
        'type',
        'sort_order',
        'title',
        'description'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function multimediaType()
    {
        return $this->belongsTo(MultimediaType::class, 'multimedia_type_id');
    }
}
