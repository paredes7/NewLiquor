import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="bg-darkGray text-center py-12 mt-10 border-t border-darkTurquoise shadow-inner"
      
    >
    
      <p className="text-grayCustom font-medium tracking-wide mb-6">
        © {new Date().getFullYear()} Maro Uniformes — Todos los derechos reservados.
      </p>

      
      <div className="flex justify-center mb-6">
        <a
          href="https://www.instagram.com/marouniformes2023"
          target="_blank"
          rel="noopener noreferrer"
          className="text-turquoise hover:text-darkTurquoise transition-colors"
        >
          <FaInstagram size={36} />
        </a>
      </div> 
 
      <div className="text-grayCustom text-sm space-y-3">
        <p className="text-lg text-turquoise font-semibold">
           56 978843627
        </p>

        <p className="text-xs tracking-wide">
          Política de privacidad | Términos de uso
        </p>

        <div className="mt-4 text-grayCustom font-medium">
          <p className="text-turquoise font-semibold mb-1">CHILE 🇨🇱</p>
          <p>Atención personalizada vía WhatsApp e Instagram</p>
        </div>
      </div>
    </footer>
  );
}
