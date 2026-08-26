import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider= ({children}) => {
    // 1. Inicializar el estado leyendo directamente de localStorage
    const [dark, setDark] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    // 2. Aplicar la clase al HTML y guardar en localStorage ante cada cambio
    useEffect(() => {
        // document.documentElement representa la etiqueta <html>
        document.documentElement.classList.toggle("dark", dark);
        localStorage.setItem("theme", JSON.stringify(dark));
    }, [dark]);

    const toggleTheme = () => setDark(prev => !prev)
    
  return (
    <ThemeContext.Provider value={{dark, toggleTheme}}>
        {children}
    </ThemeContext.Provider>
  )
}


/* El rol de useTheme es simplemente ser un "atajo" limpio para no tener que 
importar useContext y ThemeContext en cada componente donde quieras cambiar el tema. */
// 3. Tu hook personalizado (simple y perfecto)
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}
