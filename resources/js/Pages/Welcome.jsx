import Products from '@/Components/welcome/Products';
import Layout from '@/Layouts/MainLayout';
import Videos from '@/Components/welcome/Videos';
export default function Welcome({ auth }) {
    return (
        <Layout title="Exclusive|Inicio" auth={auth}>
            <Videos/>
            <Products />
        </Layout>
    );
}
