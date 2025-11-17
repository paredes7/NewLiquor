import { useState, useEffect } from "react";

export default function ProductFormModal({ categoryId, product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(product?.image || null);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    const file = files ? files[0] : null;
    setFormData(prev => ({ ...prev, [name]: file || value }));
    if (name === "image" && file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      let url = `/admin/products`;
      let method = "POST";

      if (product) {
        url = `/admin/products/${product.id}`;
        data.append('_method', 'PUT');
      } else {
        data.append('category_id', categoryId);
      }

      const res = await fetch(url, {
        method,
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
        body: data,
      });

      const json = await res.json();

      if (json.status === "success") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSave(json.product, !!product);
        }, 1500);
      } else {
        alert("Error al guardar producto");
        console.error(json);
      }

    } catch (err) {
      console.error(err);
      alert("Error en la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Spinner fullscreen */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-24 h-24 border-4 border-gray-200 border-t-pink-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Mensaje éxito fullscreen */}
      {success && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex justify-center items-center z-50">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">¡Producto guardado correctamente!</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {!loading && !success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {product ? "Editar" : "Agregar"} Producto
            </h2>

            {/* Preview de imagen */}
            <div className="flex gap-4 items-center">
              {product && product.image && (
                <div className="flex-1 text-center">
                  <p className="text-sm text-gray-500 mb-1">Imagen actual</p>
                  <img src={product.image} alt="Actual" className="w-full max-w-[150px] h-auto rounded border"/>
                </div>
              )}
              {preview && (
                <div className="flex-1 text-center">
                  <p className="text-sm text-gray-500 mb-1">{product ? "Nueva imagen" : "Imagen a agregar"}</p>
                  <img src={preview} alt="Preview" className="w-full max-w-[150px] h-auto rounded border"/>
                </div>
              )}
            </div>

            {/* Inputs */}
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <textarea
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="w-full"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
              >
                {product ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
