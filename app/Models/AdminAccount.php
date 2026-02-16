<?php
// app/Models/AdminAccount.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class AdminAccount extends Authenticatable
{
    // Dentro de la clase AdminAccount
    public $incrementing = false; // Indica que el ID lo manejamos nosotros manualmente
    protected $keyType = 'int';   // Define que el ID sigue siendo un entero
    protected $table = 'admin_accounts';
    protected $fillable = ['username', 'email', 'password'];
    protected $hidden = ['password'];
}
