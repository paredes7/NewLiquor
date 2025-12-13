import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';


export default function CartModaladmin({ isOpen, onClose }) {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);


  const descontarStock = async () => {
  try {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const response = await fetch(route('admin.stock.descontar'), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      body: JSON.stringify({
        items: cart.map(item => ({ sku: item.options.sku, qty: item.qty }))
      })
    });
    
    const data = await response.json();

    if (data.success) {
      alert(data.message); // O un toast bonito
      clearCart();
      onClose();
    } else {
      alert(data.message || 'Error desconocido');
    }

  } catch (err) {
    alert('Error en la conexión');
    console.error(err);
  }
};




  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setShow(true), 20);
    } else {
      setShow(false);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000000] flex justify-end transition-colors duration-300
        ${show ? 'bg-black/50' : 'bg-black/0'}`}
    >
      <div
        className={`
          bg-white w-full sm:w-96 h-full p-6 relative flex flex-col text-black shadow-2xl rounded-l-3xl
          transform transition-transform duration-300
          ${show ? 'translate-x-0' : 'translate-x-full'}
        `}
      >

        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
          onClick={onClose}
        >
          <X size={24} />
        </button>


        <div className="flex justify-between items-center mb-4 mr-16">
          <h2 className="text-2xl font-bold">Admin</h2>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center text-gray-600 hover:text-gray-800 transition"
            >
              <Trash2 size={18} className="mr-1" />
              Vaciar
            </button>
          )}
        </div>


        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">El carrito está vacío</p>
          ) : (
            cart.map(item => (
              <div key={item.rowId} className="flex items-center gap-4 p-2 bg-gray-100 rounded-xl">
                <img
                  src={item.options.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 flex flex-col justify-between h-full">
                  <p className="font-semibold truncate">{item.name}</p>

                  {item.options.variant && (
                    <p className="text-sm text-gray-500">{item.options.variant}</p>
                  )}
                  {item.options.sku && (
                    <p className="text-sm text-gray-500">{item.options.sku}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.rowId, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="p-1 bg-gray-300 rounded-l hover:bg-gray-400 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item.rowId, item.qty + 1)}
                      className="p-1 bg-gray-300 rounded-r hover:bg-gray-400 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between h-full">
                  <p className="font-bold">
                    $ {(item.price * item.qty).toFixed(2)}
                  </p>
                  <button
                    className="text-gray-600 text-sm mt-1 hover:text-gray-800"
                    onClick={() => removeFromCart(item.rowId)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>


        {cart.length > 0 && (
          <div className="mt-4 border-t border-gray-300 pt-4 flex flex-col gap-4">
            <p className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>$ {total.toFixed(2)}</span>
            </p>


            <button
              onClick={descontarStock}
              className="block w-full py-3 text-center bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition"
            >
              Descontar del Stock
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
