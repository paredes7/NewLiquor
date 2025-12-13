export default function OrderSummary({ cart, subtotal, total, loading }) {
    return (
        <div className="bg-white border border-grayCustom rounded-2xl p-6 mb-6 shadow-lg">
            <h3 className="text-darkGray font-bold text-2xl mb-4 border-b border-grayCustom pb-2">
                Resumen del pedido
            </h3>

            {loading ? (
                <p className="text-grayCustom">Cargando resumen del pedido...</p>
            ) : (
                <div className="space-y-3">
                    <div className="flex justify-between text-grayCustom">
                        <span>Total artículos:</span>
                        <span className="font-semibold text-darkGray">{cart.length}</span>
                    </div>

                    <div className="flex justify-between text-grayCustom">
                        <span>Subtotal:</span>
                        <span className="font-semibold text-darkGray">{Number(subtotal).toFixed(2)} $</span>
                    </div>

                    <div className="flex justify-between text-grayCustom">
                        <span>Total:</span>
                        <span className="font-bold text-turquoise text-lg">{Number(total).toFixed(2)} $</span>
                    </div>
                </div>
            )}
        </div>
    );
}
