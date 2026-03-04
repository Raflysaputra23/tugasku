"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextProps {
    theme: string;
    toggleTheme: () => void;
    isDark: boolean;
    loading: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({ theme: "dark", toggleTheme: () => { }, isDark: true, loading: true });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(() => {
        if(typeof window !== "undefined") {
            setLoading(false);
            return localStorage.getItem("theme") || "dark";
        }
        return "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = (prev === "dark") ? "light" : "dark";
            document.documentElement.classList.remove(prev);
            document.documentElement.classList.add(newTheme);
            return newTheme;
        });
    };


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark", loading }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};

