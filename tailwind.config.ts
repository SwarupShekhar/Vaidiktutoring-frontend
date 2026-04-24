import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                'ice-blue': 'var(--color-ice-blue)',
                'powder-blue': 'var(--color-powder-blue)',
                'sapphire': 'var(--color-sapphire)',
                'deep-navy': 'var(--color-deep-navy)',
            },
            fontFamily: {
                luckiest: ['var(--font-luckiest-guy)'],
            },
            zIndex: {
                '60': '60',
                '1000': '1000',
                '9999': '9999',
                '10000': '10000',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
