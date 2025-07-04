import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: '/', 
  }

  // Si el comando es 'build' (para producción), cambia la base
  if (command === 'build') {
    config.base = '/mi-pokedex-vite/'
  }

  return config
})
