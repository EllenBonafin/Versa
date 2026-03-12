/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        foreground: '#1A1A1A',
        gold: '#C9A96E',
        'gold-light': '#E8D5B0',
        'gold-dark': '#A07C42',
        muted: '#6B7280',
        'muted-foreground': '#9CA3AF',
        surface: '#F0EFE9',
        border: '#E5E4DE',
      },
      fontFamily: {
        'playfair': ['PlayfairDisplay_400Regular'],
        'playfair-medium': ['PlayfairDisplay_500Medium'],
        'playfair-semibold': ['PlayfairDisplay_600SemiBold'],
        'playfair-bold': ['PlayfairDisplay_700Bold'],
        'playfair-italic': ['PlayfairDisplay_400Regular_Italic'],
        'lora': ['Lora_400Regular'],
        'lora-medium': ['Lora_500Medium'],
        'lora-semibold': ['Lora_600SemiBold'],
        'lora-italic': ['Lora_400Regular_Italic'],
      },
    },
  },
  plugins: [],
};
