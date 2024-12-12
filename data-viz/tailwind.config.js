/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./pages/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
     
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
         // Add our custom color here
         red: {
          50: '#fff1f0',
          100: '#ffdfdb',
          200: '#ffc4bd',
          300: '#ffa599',
          400: '#ff8575',
          500: '#ff6a55',
          600: '#ff2b0f',
          700: '#cc1800',
          800: '#8a1000',
          900: '#420800',
          950: '#240400'
        },
        indigo: {
          50: '#e2e8f3',
          100: '#c9d3e9',
          200: '#92a8d3',
          300: '#5c7cbd',
          400: '#3b5891',
          500: '#243659',
          600: '#1d2c49',
          700: '#162136',
          800: '#0f1624',
          900: '#070b12',
          950: '#030407'
        },
        green: {
          50: '#f3f9f1',
          100: '#e7f3e3',
          200: '#cfe6c6',
          300: '#b4d8a7',
          400: '#9ccc8a',
          500: '#83bf6e',
          600: '#62a649',
          700: '#497c37',
          800: '#325525',
          900: '#192a13',
          950: '#0d1509'
        },
        yellow: {
          50: '#fffaf0',
          100: '#fff5e0',
          200: '#ffebc2',
          300: '#ffe0a3',
          400: '#ffd685',
          500: '#ffcc66',
          600: '#ffb41f',
          700: '#d68f00',
          800: '#8f5f00',
          900: '#473000',
          950: '#241800'
        },
        cyan: {
          50: '#ebf3ff',
          100: '#d6e8ff',
          200: '#a8ceff',
          300: '#80b7ff',
          400: '#57a0ff',
          500: '#2a85ff',
          600: '#0068f0',
          700: '#004db3',
          800: '#003375',
          900: '#001b3d',
          950: '#000d1f'
        },
        violets: {
          50: '#f5f0ff',
          100: '#eae0ff',
          200: '#d2bdff',
          300: '#bd9eff',
          400: '#a47aff',
          500: '#8e59ff',
          600: '#5f14ff',
          700: '#4200d1',
          800: '#2c008a',
          900: '#170047',
          950: '#0b0024'
        }
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
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [
    import('tailwindcss-rtl'),
    import("tailwindcss-animate")
  ],
  
}
