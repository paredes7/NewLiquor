import { useEffect, useState } from 'react';
import SearchBar from '@/Components/welcome/Search';
import { useCart } from '@/Contexts/CartContext';
import CategoryFilter from './CategoryFilter';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const { addToCart } = useCart();
  ////////////////////////////////Super importante/////////////////////////////////////////////////////////
  const priorityCategories = ['Destacados', 'Ofertas'];
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setLoading(true);
    fetch('/products')
      .then(res => res.json())
      .then(data => {
        let cats = Array.isArray(data) ? data : [];
        // Ordenar categorías prioritarias al inicio
        cats.sort((a, b) => {
          const indexA = priorityCategories.indexOf(a.name);
          const indexB = priorityCategories.indexOf(b.name);
          if (indexA !== -1 || indexB !== -1) return indexA !== -1 ? -1 : 1;
          return 0;
        });
        setCategories(cats);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar productos:', err);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product) => {
    if (product.stock === 0) return;
    setAddingId(product.id);
    await addToCart({
      id: product.id,
      nombre: product.name,
      precio: product.price,
      cantidad: 1,
      image: product.image || 'https://via.placeholder.com/100',
    });
    setAddingId(null);
    setSuccessId(product.id);
    setTimeout(() => setSuccessId(null), 1500);
  };

  if (loading) {
    return <p className="text-center mt-8 text-gray-600">Cargando productos...</p>;
  }

  const displayedCategories = selectedCategory
    ? categories.filter(cat => cat.name === selectedCategory)
    : categories;

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <SearchBar onSearch={setSearchTerm} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {displayedCategories.map((category, idx) => {
        const filteredProducts = category.products.filter(product => {
  const name = (product.name ?? "").toLowerCase();
  const search = searchTerm.toLowerCase();
  return name.includes(search);
});

        if (filteredProducts.length === 0) return null;

        // Condiciones de carrusel según dispositivo
        const isMobileCarousel = filteredProducts.length > 1;
        const isTabletCarousel = filteredProducts.length >= 2;
        const isDesktopCarousel = filteredProducts.length > 3;

        return (
          <div key={category.id} className="mb-12">
            {/* Separador */}
            {idx !== 0 && (
              <div className="my-12 flex items-center gap-4">
                <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-brandGold/50 to-transparent"></div>
              </div>
            )}


            <div className="relative mb-6">
              {/* Línea decorativa superior */}
              <div className="absolute -top-3 left-0 w-20 h-1 bg-brandGold rounded-full shadow-lg"></div>

              {/* Nombre de la categoría */}
              <h2 className="text-4xl font-extrabold text-brandBlack dark:text-white tracking-wide
                drop-shadow-md flex items-center gap-3">
                <span className="text-brandGold text-5xl">✦</span>
                {category.name}
              </h2>

              {/* Línea subrayada animada */}
              <div className="mt-2 h-1 w-full bg-gradient-to-r from-brandGold/80 to-transparent rounded-full"></div>
            </div>


            {/* Descripción de categoría */}
            {category.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg italic pl-2">
                {category.description}
              </p>
            )}
            {(isDesktopCarousel || isTabletCarousel || isMobileCarousel) ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={isDesktopCarousel || isTabletCarousel}
                pagination={false}
                autoplay={isDesktopCarousel ? { delay: 2000, disableOnInteraction: false } : false}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {filteredProducts.map(product => (
                  <SwiperSlide key={product.id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={handleAddToCart}
                      addingId={addingId}
                      successId={successId}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    handleAddToCart={handleAddToCart}
                    addingId={addingId}
                    successId={successId}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function ProductCard({ product, handleAddToCart, addingId, successId }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className={`
      relative overflow-hidden rounded-3xl shadow-2xl border 
      ${isOutOfStock ? "opacity-70 border-red-400" : "border-brandGold border-2"}
      bg-white dark:bg-zinc-800 
      hover:scale-[1.03] hover:shadow-3xl 
      transition-all duration-300
    `}
    >
      {/* Cinta de agotado */}
      {isOutOfStock && (
        <div className="absolute top-4 left-0 bg-red-600 text-white px-4 py-1 text-sm font-bold rounded-r-xl shadow-lg">
          Agotado
        </div>
      )}

      {/* Imagen */}
      <div className="w-full h-72 sm:h-80 lg:h-96 overflow-hidden">
        <img
          src={product.image || "https://via.placeholder.com/600x400"}
          alt={product.name}
          className="w-full h-full object-cover object-center rounded-t-3xl"
        />
      </div>

      {/* Contenido */}
      <div className="p-6">

        {/* Nombre del producto */}
        <h3 className="text-2xl font-bold text-brandBlack dark:text-white tracking-wide drop-shadow-sm">
          {product.name}
        </h3>

        {/* Descripción corta */}
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-3">
          {product.description}
        </p>

        {/* STOCK llamativo */}
        <div className="mt-4">
          <span
            className={`
              inline-block px-4 py-2 text-sm font-bold rounded-xl 
              shadow-md border 
              ${isOutOfStock
                ? "bg-red-100 text-red-700 border-red-400"
                : "bg-green-100 text-green-700 border-green-400"
              }
            `}
          >
            {isOutOfStock ? "Sin stock" : `Stock: ${product.stock}`}
          </span>
        </div>

        {/* PRECIO gigante tipo tarjeta comercial */}
        <p className="mt-4 text-3xl font-extrabold text-brandGold drop-shadow-sm">
          Bs {Number(product.price).toFixed(2)}
        </p>

        {/* Botón */}
        <button
          onClick={() => handleAddToCart(product)}
          disabled={addingId === product.id || isOutOfStock}
          className={`
            mt-6 w-full py-3 rounded-xl text-lg font-bold
            transition-all shadow-lg
            ${addingId === product.id
              ? "bg-gray-400 text-white cursor-not-allowed"
              : successId === product.id
                ? "bg-green-500 text-white"
                : "bg-brandGold text-brandBlack hover:bg-[#bfa333]"
            }
          `}
        >
          {isOutOfStock
            ? "No disponible"
            : addingId === product.id
              ? "Agregando..."
              : successId === product.id
                ? "¡Agregado!"
                : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}

