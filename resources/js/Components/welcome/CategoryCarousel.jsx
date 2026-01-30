import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from '@inertiajs/react';
import 'swiper/css';
import 'swiper/css/navigation';

export default function CategoryCarousel() {
    const CATEGORIES = [
        { name: 'Whisky', img: 'https://images.unsplash.com/photo-1527281473222-79432684727f?q=80&w=400', slug: 'whisky' },
        { name: 'Ron', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400', slug: 'ron' },
        { name: 'Vino', img: 'https://images.unsplash.com/photo-1510853483901-af489526a118?q=80&w=400', slug: 'vino' },
        { name: 'Tequila', img: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=400', slug: 'tequila' },
        { name: 'Ginebra', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400', slug: 'ginebra' },
        { name: 'lo que deseas', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400', slug: 'ginebra' },
        { name: 'lo que deseas 2', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400', slug: 'ginebra' },
    ];

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">Explora nuestras categorías</h2>
                
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="category-swiper"
                >
                    {CATEGORIES.map((cat) => (
                        <SwiperSlide key={cat.slug}>
                            <Link href={`/categorias/${cat.slug}`} className="group relative block overflow-hidden rounded-2xl aspect-square shadow-lg bg-black">
                                <img 
                                    src={cat.img} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <span className="text-white text-xl font-bold uppercase tracking-widest">{cat.name}</span>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}