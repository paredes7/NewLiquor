import Layout from '@/Layouts/MainLayout';
import Banner from '@/Components/welcome/WelcomeSe/Banner';
import WelcomeSection from '@/Components/welcome/WelcomeSe/WelcomeSection';
import CategoriesGrid from '@/Components/welcome/WelcomeSe/CategoriesGrid';
import CTAContact from '@/Components/welcome/WelcomeSe/CTAContact';

export default function Welcome({ categories, search, page, hasMore }) {
  
  return (
    <Layout title="Pragati Motors | Bolivia">
      
      <Banner img="https://res.cloudinary.com/dnbklbswg/image/upload/v1767755747/banner_yfcfdc.jpg" />
      
      
      <WelcomeSection />
      
      <CategoriesGrid categories={categories} hasMore={hasMore} />
      
      
      <CTAContact />
    </Layout>
  );
}
