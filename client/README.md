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

# useCallback
- Aquí entra useCallback
```const fetchDoctors = useCallback(
  () => api.getDoctors(),
  []
)```
le dice a React aproximadamente:

"Memoriza esta función. Mientras sus dependencias no cambien, reutiliza la misma referencia."
- useCallback para memorizar la función que obtiene los Doctors.