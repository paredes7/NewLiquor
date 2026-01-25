import Layout from '@/Layouts/MainLayout';
import HomeSearch from '@/Components/welcome/HomeSearch';
import Footer from '@/Components/welcome/Footer';

// Recibimos 'search' de Laravel
export default function ResultPage({ search, products }) { // Recibe las props
    return (
        <Layout title={`Resultados para: ${search}`}>
            <HomeSearch />
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-white text-3xl font-bold">
                    Buscando: <span className="text-orange-600">"{search}"</span>
                </h1>
            </div>
           
        </Layout>
    );
}