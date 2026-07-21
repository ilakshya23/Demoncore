import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0B0A0C',
        voidDeep: '#050506',
        obsidian: '#141215',
        ash: '#8A8386',
        parchment: '#EDEAE2',
        core: {
          ember: '#FF5A2E',
          emberDim: '#B8431F',
          glow: '#FFA46B',
        },
        mode: {
          survival: '#4C9A6A',
          pvp: '#8A98A6',
          lifesteal: '#C81E3A',
          events: '#C9A227',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'crack-line': 'linear-gradient(90deg, transparent, var(--tw-gradient-stops), transparent)',
      },
      keyframes: {
        emberPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        crackTravel: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        emberPulse: 'emberPulse 2.4s ease-in-out infinite',
        crackTravel: 'crackTravel 3.5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
