import { Head } from '@inertiajs/react';
import Header from '@/Components/welcome/Header';
import Products from '@/Components/welcome/Products';
import Footer from '@/Components/welcome/Footer';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Carrito de Compras" />
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
                <Header auth={auth} />
                <main className="flex-1 container mx-auto px-6 py-10">
                    <Products />
                </main>
                <Footer />
            </div>
        </>
    );
}
