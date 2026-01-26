import Layout from "@/Layouts/MainLayout";
import EventContent from "@/Components/welcome/Eventos/EventContent";

export default function Event({eventDetail}) {

    console.log("Detalle del evento recibido:", eventDetail);

    return (
        <Layout title="Pragati Motors | Bolivia">
            <EventContent eventDetail={eventDetail} />
        </Layout>
    );
}
