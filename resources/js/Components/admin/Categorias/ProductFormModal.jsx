import { useState } from "react";

export default function ProductFormModal({ categoryId, product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
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

      let url = "/admin/products";
      let method = "POST";

      if (product) {
        url = `/admin/products/${product.id}`;
        data.append("_method", "PUT");
      } else {
        data.append("category_id", categoryId);
      }

      const res = await fetch(url, {
        method,
        headers: { "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content },
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
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-24 h-24 border-4 border-gray-200 border-t-pink-600 rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && !success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 grid gap-6 overflow-auto max-h-[90vh]"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {product ? "Editar" : "Agregar"} Producto
            </h2>

            {/* PREVIEW */}
            {preview && (
              <div className="text-center">
                <img src={preview} className="w-40 mx-auto rounded border" />
              </div>
            )}

            {/* INPUTS */}
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Precio ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Imagen</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
