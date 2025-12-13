export default function ViewOrderModal({ order, onClose }) {
  console.log("orden", order);

  // Convertir total a número por seguridad
  const total = Number(order.total);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl overflow-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold mb-3">Detalle del Pedido #{order.id}</h3>

        <p><strong>Cliente:</strong> {order.customer_name} ({order.customer_phone})</p>
        <p><strong>Estado:</strong> {order.status?.name}</p>
        <h4 className="mt-4 mb-2 font-semibold">Productos</h4>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border-b">Imagen</th>
                <th className="py-2 px-3 border-b">Producto</th>
                <th className="py-2 px-3 border-b">SKU</th>
                <th className="py-2 px-3 border-b">Precio Unit.</th>
                <th className="py-2 px-3 border-b">Cantidad</th>
                <th className="py-2 px-3 border-b">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => {
                const variant = item.product?.variants?.find(v => v.sku === item.sku);
                const price = Number(variant?.price ?? item.price);
                const subtotal = price * item.quantity;
                const imgUrl = variant?.multimedia?.[0]?.url || item.product?.multimedia?.[0]?.url;

                return (
                  <tr key={item.id} className="text-center">
                    <td className="py-2 px-3 border-b">
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover mx-auto rounded"
                        />
                      )}
                    </td>
                    <td className="py-2 px-3 border-b">
                      {item.product?.name}
                      <div className="text-sm text-gray-500">
                         {item.variant_value} {/* valor de variante o fallback sku */}
                      </div>
                    </td>
                    <td className="py-2 px-3 border-b">{item.sku}</td>
                    <td className="py-2 px-3 border-b">{price.toFixed(2)} bs</td>
                    <td className="py-2 px-3 border-b">{item.quantity}</td>
                    <td className="py-2 px-3 border-b">{subtotal.toFixed(2)} bs</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="py-2 px-3 font-semibold text-right border-t">Total:</td>
                <td className="py-2 px-3 font-semibold border-t">{total.toFixed(2)} bs</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="text-right mt-5">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
