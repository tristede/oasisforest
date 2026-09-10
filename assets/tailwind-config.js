// Configuration Tailwind (CDN), partagee par toutes les pages du site.
// Doit etre chargee APRES cdn.tailwindcss.com et AVANT le rendu.

tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                handwriting: ['Caveat', 'cursive'],
            },
            colors: {
                night: '#020617',
                glass: 'rgba(255, 255, 255, 0.05)',
                glassBorder: 'rgba(255, 255, 255, 0.1)',
                accent: '#00c2ff',
                accentDark: '#0091ea'
            },
            animation: {
                'marquee': 'marquee 25s linear infinite',
                'blob': 'blob 10s infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                }
            }
        }
    }
}
