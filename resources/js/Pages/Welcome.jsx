import Products from '@/Components/welcome/Products';
import Layout from '@/Layouts/MainLayout';
import Videos from '@/Components/welcome/Videos';
export default function Welcome({ auth, categories, search, page, hasMore }) {
    console.log(categories);
    return (
            <Layout title="Maro|Inicio" auth={auth}>
                <Products
                    categories={categories} 
                    search={search} 
                    page={page} 
                    hasMore={hasMore}  
                />
            </Layout>
        );
}
