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
      <Head title={title || "Tienda de Ropa"} />

      <div className="min-h-screen flex flex-col bg-white text-black relative">
        <Header auth={auth} />
        <main className="flex-1 container mx-auto px-6 py-10">
          {children}
        </main>
        <Footer />

        
        <div className="fixed bottom-6 right-6 z-[9999] ">
          <CartIcon
            className="text-black hover:text-gray-800 transition"
            onClick={() => setCartOpen(true)}
          />
        </div>

        
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setCartOpen(false)}
          className="z-[99999]"
        />

        <a
  href="https://wa.me/69791784"
  target="_blank"
  className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center hover:bg-[#1ebe57] transition z-[1000]"
>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    className="w-10 h-10"
  />
</a>
      </div>
    </CartProvider>
  );
}
