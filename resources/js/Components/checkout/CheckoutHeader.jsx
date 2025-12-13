import { Link } from '@inertiajs/react';
import { Home } from 'lucide-react';

export default function CheckoutHeader() {
    return (
        <div className="flex justify-between items-start mb-8">
            <div>
                {/* Nombre de la empresa */}
                <h1
                    className="text-4xl font-bold text-turquoise"
                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '1px' }}
                >
                    MORA
                </h1>

                <h2
                    className="text-3xl font-semibold text-darkGray mt-1"
                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '1px' }}
                >
                    UNIFORMES
                </h2>

                <p
                    className="text-sm text-grayCustom mt-2 tracking-widest"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Concepcion · Chile
                </p>
            </div>

            {/* Icono de Home */}
            <Link
                href="/"
                className="text-turquoise hover:text-darkTurquoise transition-colors"
            >
                <Home size={28} />
            </Link>
        </div>
    );
}
