import { Link} from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ParteArriba from './Header/partearriba';
import NavLink from './Header/Navlink';

export default function Header() {

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: '/', label: 'Nosotros' },
    { href: '/Productos', label: 'Productos' },
    { href: '/Post-Venta', label: 'Post-Venta' },
    { href: '/Financiamiento', label: 'Financiamiento' },
    { href: '/Sucursales', label: 'Sucursales' },
    { href: '/Noticias', label: 'Noticias' },
  ];
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
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

    
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
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-96 border-t border-gray-200' : 'max-h-0'
          }`}
        >
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-black font-semibold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}