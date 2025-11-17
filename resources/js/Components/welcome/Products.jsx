import { useEffect, useState } from 'react';
import SearchBar from '@/Components/welcome/Search';
import { useCart } from '@/Contexts/CartContext';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingId, setAddingId] = useState(null); // producto que se está agregando
  const [successId, setSuccessId] = useState(null); // producto agregado con éxito

  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/products')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar productos:', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product) => {
    setAddingId(product.id); // mostrar loading
    await addToCart({
      id: product.id,
      nombre: product.name,
      precio: product.price,
      cantidad: 1,
      image: product.image || 'https://via.placeholder.com/100', // importante
    });
    setAddingId(null); // quitar loading
    setSuccessId(product.id); // mostrar éxito
    setTimeout(() => setSuccessId(null), 1500); // desaparecer mensaje
  };

  if (loading) {
    return <p className="text-center mt-8 text-gray-600">Cargando productos...</p>;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <SearchBar onSearch={(q) => setSearchTerm(q)} />

      <h2 className="text-4xl font-semibold text-center mb-12 text-brandBlack dark:text-white">
        Productos Disponibles
      </h2>

      {categories.map(category => {
        const filteredProducts = category.products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredProducts.length === 0) return null;

        return (
          <div key={category.id} className="mb-12">
            <h2 className="text-3xl font-semibold text-brandBlack dark:text-white mb-6">
              {category.name}
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
                    <img
                      src={product.image || 'https://via.placeholder.com/600x400'}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-brandBlack dark:text-white">
                      {product.name}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-300 mt-2">
                      {product.description}
                    </p>

                    <p className="text-gray-700 dark:text-gray-100 mt-2">
                      Stock: {product.stock}
                    </p>

                    <p className="text-gray-700 dark:text-gray-100 mt-4 font-bold text-lg">
                      Bs{Number(product.price).toFixed(2)}
                    </p>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product.id}
                      className={`mt-6 w-full py-3 rounded-xl transition 
                        ${addingId === product.id ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-brandGold text-brandBlack hover:bg-[#bfa333]'}
                      `}
                    >
                      {addingId === product.id
                        ? 'Agregando...'
                        : successId === product.id
                        ? '¡Agregado!'
                        : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
