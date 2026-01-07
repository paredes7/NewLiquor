import Layout from '@/Layouts/MainLayout';
import VehicleShowcase from './VehicleShowcase';

/**
 * Componente para mostrar productos tipo vehículo (camiones, autos, etc.)
 * Usa este componente en lugar de ShowProduct para productos que necesitan:
 * - Galería mejorada con thumbnails
 * - Sección de características con tabs
 * - Selector de colores
 * - Especificaciones técnicas destacadas
 */
export default function ShowVehicle({ product }) {
 return (
    <Layout title={product.name}>
        <VehicleShowcase product={product}/>
    </Layout>
 );
}