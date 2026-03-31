import '../css/app.css';
import './bootstrap';

import React from 'react'; // Ya no necesitas useState ni useEffect aquí
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        // Renderizado directo sin el modal global
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#40E0D0', // Tu color turquesa para la barrita de arriba
    },
});