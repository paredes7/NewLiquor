import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Carousel3D = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/categories-carousel')
            .then(res => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando categorías:", err);
                setLoading(false);
            });
    }, []);

    if (loading || categories.length === 0) return null;

    const total = categories.length;
    const angle = 360 / total;
    const radius = 300; // Distancia desde el centro del círculo

    return (
        <div className="flex items-center justify-center min-h-[450px] w-full" style={{ perspective: '1200px' }}>
            <div 
                className="relative w-48 h-64 animate-carousel-3d" 
                style={{ transformStyle: 'preserve-3d' }}
            >
                {categories.map((cat, index) => (
                    <div
                        key={cat.id}
                        className="absolute inset-0 rounded-2xl border-2 border-turquoise bg-darkGray overflow-hidden shadow-xl shadow-turquoise/10"
                        style={{
                            transform: `rotateY(${index * angle}deg) translateZ(${radius}px)`,
                            backfaceVisibility: 'hidden'
                        }}
                    >
                        {/* Imagen de la categoría */}
                        <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover p-2 transition-transform duration-500 hover:scale-110" 
                        />
                        
                        {/* Etiqueta con el nombre */}
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-darkGray to-transparent p-4">
                            <p className="text-white font-poppins font-bold text-center text-xs uppercase tracking-tighter">
                                {cat.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel3D;