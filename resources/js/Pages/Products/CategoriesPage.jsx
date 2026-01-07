import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import CategoriesMenu from '@/Components/Products/CategoriesMenu';
import CategoryProducts from '@/Components/Products/CategoryProducts';

export default function CategoriesPage({ categories, selectedCategory }) {
    return (
        <MainLayout>
            <Head title={`${selectedCategory?.name || 'Pragati Motors'} | PRAGATI`} />
            <div className="min-h-screen bg-gray-50">
                <CategoriesMenu categories={categories} />
                <CategoryProducts category={selectedCategory} />
            </div>
        </MainLayout>
    );
}
