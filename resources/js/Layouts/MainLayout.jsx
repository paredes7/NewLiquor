import { Head } from '@inertiajs/react';
import Header from '@/Components/welcome/Header';
import Footer from '@/Components/welcome/Footer';
import { CartProvider } from '@/Contexts/CartContext';
import { useState } from 'react';
import CartIcon from '@/Components/welcome/Cart/CartIcon';
import CartModal from '@/Components/welcome/Cart/CartModal';

export default function Layout({ title, auth, children }) {
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <Head title={title || "Carrito de Compras"} />

      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900 relative">
        <Header auth={auth} />
        <main className="flex-1 container mx-auto px-6 py-10">
          {children}
        </main>
        <Footer />

        {/* Carrito */}
        <div className="fixed bottom-6 right-6 z-[9999]">
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>

        {/* Modal del carrito */}
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setCartOpen(false)}
          className="z-[99999]"
        />

        {/* Botón WhatsApp */}
        <a
          href="https://wa.me/63736494"
          target="_blank"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 shadow-xl flex items-center justify-center hover:bg-green-600 transition z-[9999]"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-8 h-8"
          />
        </a>
      </div>
    </CartProvider>
  );
}
