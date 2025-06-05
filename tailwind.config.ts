
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: "#06D7A5", // Verde institucional
					foreground: 'hsl(var(--primary-foreground))',
					transparent: "rgba(6, 215, 165, 0.1)"
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				eregulariza: {
					primary: '#06D7A5', // Updated to green
					secondary: '#06D7A5',
					darkGray: '#373535',
					text: '#333333',
					'primary-20': 'rgba(6, 215, 165, 0.2)',
					'primary-40': 'rgba(6, 215, 165, 0.4)',
					'secondary-20': 'rgba(6, 215, 165, 0.2)',
					'secondary-40': 'rgba(6, 215, 165, 0.4)',
				},
				// Permission-specific colors
				'admin-master': '#1e3a8a', // blue-800
				'admin-editor': '#059669', // emerald-600
				'admin-viewer': '#6b7280', // gray-500
			},
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'], // Changed from Inter to Montserrat
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'progress-loading': {
					'0%': {
						backgroundPosition: '200% 0'
					},
					'100%': {
						backgroundPosition: '-200% 0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'progress-loading': 'progress-loading 3s ease infinite'
			},
			typography: {
				DEFAULT: {
					css: {
						lineHeight: 1.6,
						letterSpacing: '0.01em',
					},
				},
			},
			backgroundImage: {
				'progress-gradient': 'linear-gradient(270deg, #06D7A5, #06D7A5, #06D7A5, #06D7A5)',
			},
			backgroundSize: {
				'400%': '400% 100%'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
