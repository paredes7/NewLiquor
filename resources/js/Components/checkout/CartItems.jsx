export default function CartItems({ cart, loading, total }) {

    return (
        <div className="border border-grayCustom p-4 rounded-2xl mb-6 bg-white shadow-lg">
            <h3 className="font-bold mb-4 text-darkGray text-xl">Artículos en tu carrito</h3>

            {loading ? (
                <p className="text-grayCustom">Cargando artículos...</p>
            ) : cart.length === 0 ? (
                <p className="text-grayCustom">No hay artículos en el carrito</p>
            ) : (
                <div className="overflow-x-auto">
                    {/* Tabla para escritorio */}
                    <table className="hidden sm:table min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-darkGray">
                                <th className="py-2 px-4 text-left"></th>
                                <th className="py-2 px-4 text-left">Producto</th>
                                <th className="py-2 px-4 text-center">Cantidad</th>
                                <th className="py-2 px-4 text-right">Precio ($)</th>
                                <th className="py-2 px-4 text-right">Subtotal ($)</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cart.map(item => {
                                const itemSubtotal = Number(item.qty) * Number(item.price);
                                return (
                                    <tr key={item.rowId} className="border-b border-grayCustom">
                                        <td className="py-2 px-4">
                                            <img
                                                src={item.options.image || 'https://via.placeholder.com/100'}
                                                alt={item.name}
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 text-darkGray font-semibold">
                                            <p>{item.name}</p>
                                            <p className="text-grayCustom text-sm">
                                                {item.options.variant || item.variant}
                                            </p>
                                        </td>
                                        <td className="py-2 px-4 text-center">{item.qty}</td>
                                        <td className="py-2 px-4 text-right">{Number(item.price).toFixed(2)}</td>
                                        <td className="py-2 px-4 text-right font-semibold">{itemSubtotal.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colSpan="4" className="py-2 px-4 text-right font-bold text-darkGray text-lg">Total:</td>
                                <td className="py-2 px-4 text-right font-bold text-lg text-turquoise">
                                    {Number(total).toFixed(2)} $
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Vista móvil */}
                    <div className="sm:hidden space-y-4">
                        {cart.map(item => {
                            const itemSubtotal = Number(item.qty) * Number(item.price);
                            return (
                                <div key={item.rowId} className="border border-grayCustom rounded-xl p-3 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.options.image || 'https://via.placeholder.com/100'}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div>
                                            <p className="text-darkGray font-semibold">{item.name}</p>
                                            <p className="text-grayCustom text-sm">{item.options.variant || item.variant}</p>
                                            <p className="text-grayCustom text-sm">Precio: {Number(item.price).toFixed(2)} $</p>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex justify-between text-sm">
                                        <span className="text-grayCustom">Cantidad:</span>
                                        <span className="font-semibold">{item.qty}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-grayCustom">Subtotal:</span>
                                        <span className="font-bold text-darkGray">{itemSubtotal.toFixed(2)} $</span>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex justify-between border-t border-grayCustom pt-3 text-lg font-bold text-darkGray">
                            <span>Total:</span>
                            <span className="text-turquoise">{Number(total).toFixed(2)} $</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
