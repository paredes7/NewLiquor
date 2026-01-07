import { Head } from '@inertiajs/react';
import Header from '@/Components/welcome/Header';
import Footer from '@/Components/welcome/Footer';
import { CartProvider } from '@/Contexts/CartContext';

export default function Layout({ title, auth, children }) {


  return (
    <CartProvider>
      <Head title={title || "PRAGATI MOTORS"} />

      <div className="min-h-screen flex flex-col bg-white text-darkGray relative">
        <Header auth={auth} />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}
