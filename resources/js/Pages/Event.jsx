import Layout from "@/Layouts/MainLayout";
import EventContent from "@/Components/welcome/Eventos/EventContent";
import AdList from "@/Components/welcome/Eventos/AdList";

export default function Event({eventDetail}) {
    // Los datos del Resource vienen envueltos en una propiedad 'data'
    const eventData = eventDetail?.data; 
    const  anuncios  = eventData?.anuncios || [];

    console.log("Detalle del evento recibido:", eventDetail);
    console.log("Anuncios relacionados:", anuncios);

    return (
        <Layout title="Pragati Motors | Bolivia">
            <EventContent eventDetail={eventDetail} />
            <AdList anuncios={anuncios} />
        </Layout>
    );
}
