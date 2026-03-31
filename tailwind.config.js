import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import animations from '@midudev/tailwind-animations';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                playfair: ['Playfair Display', 'serif'],
                poppins: ['Poppins', 'sans-serif'],
            },

            colors: {
                darkGray: '#231f20',
                grayCustom: '#939191',
                turquoise: '#01a387',
                darkTurquoise: '#165a4e',
            },

           
            animation: {
                'carousel-3d': 'rotate-3d 20s linear infinite',
            },
            keyframes: {
                'rotate-3d': {
                    'from': { transform: 'rotateY(0deg)' },
                    'to': { transform: 'rotateY(360deg)' },
                }
            },
        },
    },

    plugins: [
        forms,
        animations, 
    ],
};