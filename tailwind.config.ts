import type { Config } from 'tailwindcss'


export default {
    darkMode: ['class'],
    content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
    ],
    theme: {
        container: { center: true, padding: '2rem' },
        extend: {
            colors: {
                border: 'hsl(240 5% 84%)',
                background: 'hsl(0 0% 100%)',
                foreground: 'hsl(222 47% 11%)',
                primary: {
                    DEFAULT: '#111111',
                    foreground: '#FAFAFA'
                },
                accent: '#AE0B16'
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
                mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular']
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
} satisfies Config