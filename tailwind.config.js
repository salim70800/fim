/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				md: '2rem',
				lg: '3rem',
			},
			screens: {
				sm: '640px',
				md: '1024px',
				lg: '1280px',
				xl: '1440px',
			},
		},
		extend: {
			colors: {
				// Primary - Warm Cinema Palette
				primary: {
					900: '#7c2d12',
					700: '#c2410c',
					500: '#f97316',
					400: '#fb923c',
					300: '#fdba74',
					DEFAULT: '#f97316',
				},
				// Accent - Electric Red
				accent: {
					500: '#ef4444',
					400: '#f87171',
					DEFAULT: '#ef4444',
				},
				// Neutral - Dark Surfaces
				neutral: {
					950: '#000000',
					900: '#0a0a0a',
					800: '#141414',
					700: '#1e1e1e',
					600: '#282828',
					400: '#a1a1aa',
					200: '#e4e4e7',
				},
				// Background
				background: {
					primary: '#000000',
					elevated: '#141414',
				},
				// Semantic Colors
				success: '#22c55e',
				warning: '#eab308',
				error: '#ef4444',
				info: '#3b82f6',
			},
			fontFamily: {
				arabic: ['Noto Sans Arabic', 'Cairo', 'Tajawal', 'sans-serif'],
				display: ['Almarai', 'Noto Sans Arabic', 'sans-serif'],
			},
			fontSize: {
				hero: ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
				'h1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
				'h2': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
				'h3': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
				'body-large': ['18px', { lineHeight: '1.6' }],
				'body': ['16px', { lineHeight: '1.5' }],
				'small': ['14px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
				'tiny': ['12px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
			},
			spacing: {
				'1': '4px',
				'2': '8px',
				'3': '12px',
				'4': '16px',
				'6': '24px',
				'8': '32px',
				'10': '40px',
				'12': '48px',
				'16': '64px',
				'24': '96px',
				'32': '128px',
			},
			borderRadius: {
				'sm': '8px',
				'md': '12px',
				'lg': '16px',
				'xl': '20px',
				'2xl': '24px',
				'full': '9999px',
			},
			boxShadow: {
				'elevation-subtle': '0 0 0 1px rgba(255,255,255,0.05)',
				'elevation-card': '0 0 0 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.5)',
				'elevation-hover': '0 0 0 1px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.6)',
				'glow-primary': '0 0 20px rgba(249,115,22,0.5), 0 0 40px rgba(249,115,22,0.3)',
				'glow-accent': '0 0 20px rgba(239,68,68,0.5)',
			},
			animation: {
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
			},
			keyframes: {
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.5), 0 0 40px rgba(249,115,22,0.3)' },
					'50%': { boxShadow: '0 0 30px rgba(249,115,22,0.7), 0 0 60px rgba(249,115,22,0.5)' },
				},
			},
			transitionDuration: {
				'fast': '150ms',
				'normal': '250ms',
				'slow': '400ms',
				'extra-slow': '600ms',
			},
			transitionTimingFunction: {
				'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
				'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
