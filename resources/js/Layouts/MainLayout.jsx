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
      <Head title={title || "Marou Uniformes"} />

      <div className="min-h-screen flex flex-col bg-white text-darkGray relative">
        <Header auth={auth} />

        <main className="flex-1 container mx-auto px-6 py-10">
          {children}
        </main>

        <Footer />

        {/* Ícono carrito */}
        <div className="fixed bottom-24 right-6 z-[9000]">
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>

        {/* Modal carrito */}
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setCartOpen(false)}
        />

        {/* WhatsApp */}
        <a
          href="https://wa.me/56978843627"
          target="_blank"
          rel="noopener noreferrer"
          className="
            fixed
            bottom-6
            right-6
            w-16
            h-16
            rounded-full
            bg-turquoise
            shadow-xl
            flex
            items-center
            justify-center
            hover:bg-darkTurquoise
            transition
            z-[8000]
          "
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-9 h-9"
          />
        </a>
      </div>
    </CartProvider>
  );
}
