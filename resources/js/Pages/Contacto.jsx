import Layout from "@/Layouts/LayoutCheckout";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
export default function Contacto(){

    return(
    <Layout>
        <div
      className="bg-black text-center py-10 mt-10 border-t border-gray-800 shadow-inner rounded-sm"
      style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '1px' }}
    >
      {/* Título */}
      <h2 className="text-white text-3xl font-bold mb-6">Contacto</h2>

      {/* Información de contacto */}
      <div className="text-white text-lg mb-6 space-y-2">
        <p>📞 WhatsApp: +591 69791784</p>
        <p>✉️ Correo: info@exclusive.com</p>
        <p>Política de privacidad | Términos de uso</p>
      </div>

      {/* Redes sociales grandes */}
      <div className="flex justify-center space-x-10 mb-6 text-white">
        <a 
          href="https://www.instagram.com/exclusiveoruro?igsh=MWs1NmVzZzV0d3gyMw==" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:opacity-80 transition-opacity"
        >
          <FaInstagram size={40} />
        </a>
        <a 
          href="https://www.tiktok.com/@exclusive_oruro1?_r=1&_t=ZM-91yD4bYr6yJ" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:opacity-80 transition-opacity"
        >
          <FaTiktok size={40} />
        </a>
        <a 
          href="https://wa.me/59169791784" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:opacity-80 transition-opacity"
        >
          <FaWhatsapp size={40} />
        </a>
      </div>

      {/* Sucursales */}
      <div className="text-white font-semibold space-y-2 text-lg">
        <p>BOLIVIA 🇧🇴</p>
        <p>Oruro #1: 6 de Octubre y Herrera, 1er piso — Lunes a Sábado 9:00am - 21:00pm</p>
        <p>Oruro #2: Junín y Pagador, Edificio Ruby (al lado de los baños)</p>
      </div>
    </div>
 


    </Layout>
        
    ); 

}