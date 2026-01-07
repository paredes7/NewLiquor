import Layout from '../Admin/Layouts/MainLayoutadmin';
import VehicleShowcase from './VehicleShowcase';

/**
 * Vista de administrador para productos tipo vehículo
 */
export default function ShowVehicleadmin({ product }) {
 return (
    <Layout title={product.name}>
        <VehicleShowcase product={product}/>
    </Layout>
 );
}