/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FCFBF8',
        ink: { DEFAULT: '#202124', soft: '#4A4D52', mute: '#6B6F76' },
        line: { DEFAULT: '#E8E4DC', strong: '#D6D0C4' },
        brand: { DEFAULT: '#FF6A1A', deep: '#C2410C', tint: '#FFF0E6' },
        ok: { DEFAULT: '#1F7A4D', tint: '#E7F4EC' },
        warn: { DEFAULT: '#9A5B00', tint: '#FFF3D6', bar: '#E8A317' },
        risk: { DEFAULT: '#B42318', tint: '#FDEBE9' },
        info: { DEFAULT: '#2457A6', tint: '#E8F0FB' },
      },
      fontFamily: {
        sans: ['"Instrument Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Bricolage Grotesque Variable"', '"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 1px 2px rgba(32,33,36,0.05)' },
    },
  },
  plugins: [],
}
