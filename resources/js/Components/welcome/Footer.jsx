export default function Footer() {
    return (
        <footer className="bg-white dark:bg-zinc-800 text-center py-6 mt-10 border-t border-gray-200 dark:border-zinc-700">
            <p className="text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Saat Shop. Todos los derechos reservados.
            </p>
        </footer>
    );
}
