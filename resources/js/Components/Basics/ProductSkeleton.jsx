import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="w-full h-full p-3 animate-pulse">
            <div className="relative flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
                
                {/* Espacio para la imagen (Relación de aspecto similar a tus botellas) */}
                <div className="aspect-[4/5] bg-gray-100 w-full" />

                {/* Contenido inferior */}
                <div className="p-6 flex flex-col gap-3 items-center">
                    {/* Skeleton para la categoría (arriba en gris) */}
                    <div className="h-2 bg-gray-100 rounded w-1/3" />

                    {/* Skeleton para el nombre del producto (grande) */}
                    <div className="h-4 bg-gray-100 rounded w-3/4 mt-1" />
                    
                    {/* Skeleton para el volumen (pequeño) */}
                    <div className="h-3 bg-gray-100 rounded w-1/4" />

                    {/* Skeleton para el % Alc */}
                    <div className="h-2 bg-gray-100 rounded w-1/2 mt-2" />

                    {/* Skeleton para el Precio */}
                    <div className="h-6 bg-gray-100 rounded w-1/3 mt-3" />

                    {/* Skeleton para el botón 'Añadir al carrito' */}
                    <div className="h-10 bg-gray-100 rounded-xl w-full mt-4" />
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;