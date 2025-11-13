import { useEffect, useState } from 'react';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/products') // endpoint API
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

  if (loading) {
    return <p className="text-center mt-8 text-gray-600">Cargando productos...</p>;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-semibold text-center mb-12 text-brandBlack dark:text-white">
        Productos Disponibles
      </h2>
      {categories.map(category => (
        <div key={category.id} className="mb-12">
          <h2 className="text-3xl font-semibold text-brandBlack dark:text-white mb-6">
            {category.name}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map(product => (
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
                    ${Number(product.price).toFixed(2)}
                  </p>
                  <button className="mt-6 w-full bg-brandGold text-brandBlack py-3 rounded-xl hover:bg-[#bfa333] transition">
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
