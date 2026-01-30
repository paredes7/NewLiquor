import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import ParteArriba from './Header/partearriba';
import NavLink from './Header/Navlink';
import MegaMenu from './Header/MegaMenu';

export default function Header() {

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);


  const [expandedSection, setExpandedSection] = useState(null);

  const currencyRef = useRef(null);

  const { categories, allSubCategories, otrosLicoresData, NewProducts } = usePage().props;
  console.log("Categorías que llegan del servidor:", categories);
  console.log("Subcategorías que llegan del servidor:", allSubCategories);
  const [activeMenu, setActiveMenu] = useState(null);


  const [selectedCurrency, setSelectedCurrency] = useState({ 
    code: 'BO', label: 'Bolivia | BOB', flag: 'bo' 
  });

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
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el menú está abierto y el clic NO es dentro del div referenciado
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setCurrencyOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ParteArriba/>
      
       <header
        className={`w-full animate-blurred-fade-in bg-white shadow-md transition-all duration-300 sticky top-0 z-50 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-6">
       
          <Link href="/" className="flex items-center">
            <img
              src="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg"
              alt="Pragbati | Nibol Logo"
              className={`transition-all duration-300 object-contain ${
                isScrolled ? 'h-12 w-32 md:h-14 md:w-40' : 'h-16 w-40 md:h-20 md:w-56'
              }`}
            />
          </Link>

     
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
            {NAV_LINKS.map((link) => {
              const isOtros = link.label === 'Otros licores';
              const isNuevos = link.label === 'Nuevos';
              // 1. Buscamos el padre normal (Whisky, Tequila, Vino)
              const currentParent = categories?.find((cat) => {
                const labelLimpio = link.label.toLowerCase().trim();
                const slugLimpio = cat.slug.toLowerCase().trim();
                return slugLimpio === labelLimpio;
              });

              // 2. Decidimos qué mostrar: 
              // Si es "Otros", usamos la prop 'otrosLicoresData'. Si no, filtramos hijos normales.
              const displaySubCategories = isNuevos 
                ? NewProducts 
                : (isOtros ? otrosLicoresData : allSubCategories?.filter(sub => sub.parent_id === currentParent?.id) || []);

              return (
                <div 
                  key={link.href}
                  className="relative"
                  // CAMBIO: Si es Otros, activamos con un string fijo 'otros'
                  onMouseEnter={() => {
                    if (isNuevos) setActiveMenu('nuevos');
                    else if (isOtros) setActiveMenu('otros');
                    else if (currentParent) setActiveMenu(currentParent.slug);
                  }}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <NavLink href={link.href} className="flex items-center gap-1 py-4">
                    {link.label}
                  </NavLink>

                  {/* 3. Renderizado condicional ajustado */}
                  {activeMenu && (
                    (isNuevos && activeMenu === 'nuevos') || 
                    (isOtros && activeMenu === 'otros') || 
                    (activeMenu === currentParent?.slug)
                  ) && displaySubCategories.length > 0 && (
                    <MegaMenu 
                      parentCategory={isNuevos ? { name: 'Novedades', slug: 'nuevos' } : (isOtros ? { name: 'Otros Licores', slug: 'otros' } : currentParent)} 
                      subCategories={displaySubCategories} 
                      type={isNuevos ? 'products' : 'categories'} 
                    />
                  )}
                </div>
              );
            })}
          </nav>
                    

          {/* Selector de Moneda/País */}
          <div ref={currencyRef} className="relative w-44 flex justify-end">
            <button 
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="w-full flex items-center justify-between gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors py-2 px-3 border border-gray-100 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <img 
                  src={`https://flagcdn.com/w20/${selectedCurrency.flag}.png`} 
                  alt={selectedCurrency.code} 
                  className="w-5 h-auto" 
                />
                {/* Usamos whitespace-nowrap para que el texto no salte de línea si es largo */}
                <span className="whitespace-nowrap">{selectedCurrency.label}</span>
              </div>
              
              <svg className={`w-4 h-4 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menú Desplegable (Dropdown) */}
            {currencyOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] py-2 animate-fade-in-down">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                  Seleccionar Moneda
                </div>
                
                {/* Mapeo de la lista de monedas */}
                {CURRENCIES.map((item) => (
                  <button 
                    key={item.code}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                      selectedCurrency.code === item.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedCurrency(item); // Actualiza la selección
                      setCurrencyOpen(false);    // Cierra el menú
                    }}
                  >
                    <img src={`https://flagcdn.com/w20/${item.flag}.png`} alt={item.code} className="w-5 h-auto" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* después de cerrar el </nav> de los links,agregando los iconos de user y carrito  */}

          <div className="hidden lg:flex items-center gap-5 text-gray-700">
            {/* Icono de Usuario */}
            <Link href="/login" className="hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Icono de Carrito */}
            <Link href="/carrito" className="hover:text-black transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Círculo de notificación opcional para el carrito */}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                0
              </span>
            </Link>
          </div>


    
          <button
            className="lg:hidden text-gray-700 hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

       
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white ${
            mobileMenuOpen ? 'max-h-[80vh] overflow-y-auto border-t border-gray-100' : 'max-h-0'
          }`}
        >
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              // 1. Lógica de Identificación (Igual que en escritorio)
              const sectionKey = link.label.toLowerCase().replace('k', 's').replace(/\s+/g, '-');
              const isExpanded = expandedSection === sectionKey;
              const isNuevos = link.label === 'Nuevos';
              const isOtros = link.label === 'Otros licores';
              
              const currentParent = categories?.find(cat => cat.slug === (isNuevos ? 'nuevos' : (isOtros ? 'otros' : sectionKey)));
              
              // 2. Selección de datos a mostrar
              const displayData = isNuevos ? NewProducts : 
                                  isOtros ? otrosLicoresData : 
                                  allSubCategories?.filter(sub => sub.parent_id === currentParent?.id) || [];

              return (
                <div key={link.href} className="flex flex-col border-b border-gray-50 last:border-none">
                  {/* Botón de Nivel Superior */}
                  <div className="flex justify-between items-center">
                    <Link
                      href={link.href}
                      className="flex-1 text-gray-700 hover:text-orange-600 font-bold py-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                    
                    {/* Si tiene datos, mostramos el botón para expandir */}
                    {displayData.length > 0 && (
                      <button 
                        onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
                        className="p-4 text-gray-400"
                      >
                        <svg 
                          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Submenú Desplegable (Acordeón) */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? 'max-h-[600px] opacity-100 mb-4' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-orange-500 bg-gray-50/50 p-3 rounded-r-xl">
                      {displayData.map((item) => (
                        <Link
                          key={item.id}
                          href={isNuevos ? `/producto/${item.slug}` : `/categorias/${item.slug}`}
                          className="flex items-center gap-4 group"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {isNuevos && item.image_url && (
                            <img src={item.image_url} className="w-10 h-10 object-contain bg-white rounded-md border border-gray-100" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">{item.name}</span>
                            <span className="text-[11px] text-gray-400">
                              {isNuevos ? `${item.price} BOB` : item.description}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </header>
      
    </>
  );
}