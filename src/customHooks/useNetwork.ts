import { useState, useEffect } from 'react';

export const useNetwork = () => {
    // navigator.onLine es una API nativa del navegador que devuelve true o false
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Escuchamos los eventos de la ventana
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Limpiamos los eventos cuando el componente se desmonta
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};