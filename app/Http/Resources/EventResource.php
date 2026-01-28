<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */

    public function toArray($request)
    {

       

        return [
            'id' => $this->id,
            // Datos para el EventCarrusel en el principal (Welcome.jsx)
            'title' => $this->title_principal_event,
            'description_event' => $this->description_event,
            'image' => $this->image_URL_principal,
            'label' => $this->label,
            
            // Datos para la vista de detalle (Event.jsx)
            'titulo_secundario' => $this->titulo_secundario,
            'texto_principal' => $this->texto_principal,
            'description' => $this->description, // Esta es la descripción larga
            'image_secundaria' => $this->image_URL_secundario,
            
            // URL de redirección controlada por Laravel
            'url' => route('eventos.show', $this->id),

            // Anuncios relacionados con el evento
             'anuncios' => AnuncioResource::collection($this->whenLoaded('anuncios')),
        ];
    }
}