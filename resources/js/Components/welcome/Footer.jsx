import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { 
      name: 'Facebook', 
      href: 'tu-link', 
      icon: <Facebook className="w-5 h-5" />, 
      hoverClass: 'hover:bg-[#1877f2]'
    },
    { 
      name: 'Instagram', 
      href: 'tu-link', 
      icon: <Instagram className="w-5 h-5" />, 
      hoverClass: 'hover:bg-cyan-500' 
    },
    { 
      name: 'YouTube', 
      href: 'tu-link', 
      icon: <Youtube className="w-5 h-5" />, 
      hoverClass: 'hover:bg-red-600' 
    },
  ];

  return (
    <footer className="bg-black text-white mt-1 border-t border-gray-900">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Columna 1: Branding y Logo */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <h3 className="text-2xl font-black tracking-tighter">NOMBRE LICORERÍA</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed italic">
              "La mejor selección de bebidas premium con entrega inmediatas."
            </p>
            
            {/* Redes Sociales con Hover Personalizado */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  className={`w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center transition-all duration-300 ${social.hoverClass}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Navegación</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-white transition">Inicio</a></li>
              <li><a href="/productos" className="hover:text-white transition">Catálogo</a></li>
              <li><a href="/ofertas" className="hover:text-white transition">Ofertas</a></li>
              <li><a href="/contacto" className="hover:text-white transition">Contacto</a></li>
            </ul>
          </div>

          {/* Columna 3: Categorías */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Categorías</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Whiskys</a></li>
              <li><a href="#" className="hover:text-white transition">Vinos Tintos</a></li>
              <li><a href="#" className="hover:text-white transition">Cervezas Artesanales</a></li>
              <li><a href="#" className="hover:text-white transition">Vodka & Ginebra</a></li>
            </ul>
          </div>

          {/* Columna 4: Botón de Acción y Advertencia */}
          <div className="space-y-6">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Atención al Cliente</h4>
            <button className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition">
              Escríbenos por WhatsApp
            </button>
            <div className="p-4 border border-gray-800 rounded-lg">
              <p className="text-[10px] text-gray-500 leading-tight uppercase text-center">
                EL ABUSO EN EL CONSUMO DE ALCOHOL ES NOCIVO PARA LA SALUD. PROHIBIDA LA VENTA A MENORES DE 18 AÑOS.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-gray-900 bg-[#050505] py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} <span className="text-white font-bold">Nombre Licorería</span>. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-gray-500 text-xs uppercase tracking-tighter">
             <a href="#" className="hover:text-white">Privacidad</a>
             <a href="#" className="hover:text-white">Términos</a>
             <a href="#" className="hover:text-white">Bolivia</a>
          </div>
        </div>
      </div>
    </footer>
  );
}