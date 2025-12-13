import { Head } from '@inertiajs/react';
import { CartProvider } from '@/Contexts/CartContext';
import { useState } from 'react';
import CartIconadmin from '../Cart/CartIconadmin';
import CartModaladmin from '../Cart/CartModaladmin';

export default function Layoutadmin({ title, auth, children }) {
  const [isCartOpen, setCartOpen] = useState(false);


  return (
    <CartProvider>
      <Head title={title || "Admin"} />



      <div className="min-h-screen flex flex-col bg-white text-black relative">
        <main className="flex-1 container mx-auto px-6 py-10">
          {children}
        </main>

      
        <div className="fixed bottom-6 right-6 z-[9999]">
          <CartIconadmin
            className="text-black hover:text-gray-800 transition"
            onClick={() => setCartOpen(true)}
          />
        </div>

        
        <CartModaladmin
          isOpen={isCartOpen}
          onClose={() => setCartOpen(false)}
          className="z-[99999]"
        />

    
      </div>
    </CartProvider>
  );
}
