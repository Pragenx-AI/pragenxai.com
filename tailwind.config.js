/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#800020',
                    dark: '#5c0017',
                    light: '#a64d61',
                    50: '#fdf5f7',
                    100: '#fce8ec',
                    200: '#f9d4db',
                    300: '#f4b0be',
                    400: '#ec8299',
                    500: '#e05476',
                    600: '#cd335a',
                    700: '#ab2447',
                    800: '#8e2140',
                    900: '#800020',
                },
                surface: '#faf5f6',
                divider: '#e8dfe0',
                // Deep dark theme colors
                dark: {
                    bg: '#000000',
                    card: '#09090b',
                    elevated: '#18181b',
                    border: '#27272a',
                    text: '#e4e4e7',
                    muted: '#a1a1aa',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                pulseRing: {
                    '0%': { transform: 'scale(0.8)', opacity: '0.5' },
                    '100%': { transform: 'scale(1.4)', opacity: '0' },
                },
                softFloat: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'fade-in-up': 'fadeInUp 0.3s ease-out',
                'scale-up': 'scaleUp 0.2s ease-out',
                'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'soft-float': 'softFloat 3s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}
