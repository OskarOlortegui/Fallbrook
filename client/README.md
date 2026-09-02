# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# trabjo usuario en /client correr

Fallbrook/client ejecuta `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process`
y luego ya npm run dev

# conectando el back con el front 
- Primero necesitamos una cosa importante — el frontend corre en localhost:5173 y el backend en localhost:8080. Para que el fetch funcione sin problemas de CORS, 
  agrega esto en `vite.config.js`:
```js
import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})```

# api.js
api.js
│
├── Hace requests
├── Verifica errores HTTP
└── Lanza errores

React Component
│
├── Llama a la API
├── Guarda los datos
├── Maneja loading
└── Decide cómo mostrar el error