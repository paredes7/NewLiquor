import { Link } from '@inertiajs/react';

export default function Header({ auth }) {
    return (
        <header className="w-full bg-white dark:bg-zinc-800 shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-6">
                <h1 className="text-2xl font-bold text-[#FF2D20]">Saat Shop 🛒</h1>
                <nav className="flex gap-4">
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className="text-gray-800 dark:text-gray-200 hover:text-[#FF2D20]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="text-gray-800 dark:text-gray-200 hover:text-[#FF2D20]"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="text-gray-800 dark:text-gray-200 hover:text-[#FF2D20]"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
