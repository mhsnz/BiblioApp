/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'], // Ensure all Svelte files are scanned
    theme: {
      extend: {
        // Add custom colors if needed, but don't override the default 'gray' palette
        colors: {
          'dark-green': '#1A3C34',
          'light-green': '#E0F2E9',
          gold: '#FFD700'
        }
      }
    },
    plugins: []
  };