import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Importación de componentes locales (Carpeta Header)
import ParteArriba from './partearriba';
import CurrencySelector from './CurrencySelector';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default function Header() {
  // 1. Estados Globales
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({ 
    code: 'BO', label: 'Bolivia | BOB', flag: 'bo' 
  });

  // 2. Datos desde el Servidor (Props de Inertia)
  const { categories, allSubCategories, otrosLicoresData, NewProducts } = usePage().props;

  // 3. Constantes de Configuración
  const CURRENCIES = [
    { code: 'BO', label: 'Bolivia | BOB', flag: 'bo' },
    { code: 'US', label: 'USA | USD', flag: 'us' },
    { code: 'CL', label: 'Chile | CLP', flag: 'cl' },
    { code: 'AR', label: 'Argentina | ARS', flag: 'ar' },
    { code: 'CO', label: 'Colombia | COP', flag: 'co' },
    { code: 'EC', label: 'Ecuador | USD', flag: 'ec' },
    { code: 'VE', label: 'Venezuela | VES', flag: 've' },
    { code: 'PE', label: 'Perú | PEN', flag: 'pe' },
    { code: 'UY', label: 'Uruguay | UYU', flag: 'uy' },
    { code: 'BR', label: 'Brasil | BRL', flag: 'br' },
  ];

  const NAV_LINKS = [
    { href: '/Nuevos', label: 'Nuevos' },
    { href: '/Ofertas', label: 'Ofertas' },
    { href: '/Whisky', label: 'Whisky' },
    { href: '/Tequila', label: 'Tequila' },
    { href: '/Vino', label: 'Vino' },
    { href: '/Otros licores', label: 'Otros licores' },
  ];

  // 4. Efectos (Scroll)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5. Función de Búsqueda (Lógica compartida)
  const handleAutoSearch = (e, searchTerm) => {
    e.preventDefault(); 
    router.get('/buscar', { search: searchTerm });
  };

  return (
    <>
      <ParteArriba />
      
      <header className={`w-full animate-blurred-fade-in bg-white shadow-md transition-all duration-300 sticky top-0 z-50 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className="container mx-auto flex justify-between items-center px-6">
          
          {/* Logo Principal */}
          <Link href="/" className="flex items-center">
            <img
              src="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg"
              alt="Logo"
              className={`transition-all duration-300 object-contain ${
                isScrolled ? 'h-12 w-32 md:h-14 md:w-40' : 'h-16 w-40 md:h-20 md:w-56'
              }`}
            />
          </Link>

          {/* Navegación para Escritorio (Extraído) */}
          <DesktopNav 
            links={NAV_LINKS}
            categories={categories}
            allSubCategories={allSubCategories}
            otrosLicoresData={otrosLicoresData}
            NewProducts={NewProducts}
            handleAutoSearch={handleAutoSearch}
          />

          {/* Acciones del Header (Moneda, Usuario, Carrito) */}
          <div className="flex items-center gap-4">
            
            {/* Selector de Moneda (Extraído) */}
            <CurrencySelector 
              currencies={CURRENCIES}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
            />

            {/* Iconos de Usuario y Carrito */}
            <div className="hidden lg:flex items-center gap-5 text-gray-700">
              <Link href="/login" className="hover:text-black transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/carrito" className="hover:text-black transition-colors relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
              </Link>
            </div>

            {/* Botón de Menú Móvil */}
            <button
              className="lg:hidden text-gray-700 hover:text-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen 
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Navegación Móvil (Extraído) */}
        <MobileNav 
          isOpen={mobileMenuOpen}
          links={NAV_LINKS}
          categories={categories}
          allSubCategories={allSubCategories}
          otrosLicoresData={otrosLicoresData}
          NewProducts={NewProducts}
          handleAutoSearch={handleAutoSearch}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </header>
    </>
  );
}