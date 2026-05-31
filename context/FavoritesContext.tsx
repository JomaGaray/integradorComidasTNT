// context/FavoritesContext.tsx
// Estado global de favoritos. Guarda en AsyncStorage para que sobreviva al cierre de la app.

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@digital_epicurean/favorites';

type FavoritesContextValue = {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  /** false hasta que terminó de leer AsyncStorage (útil para evitar parpadeos) */
  ready: boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // 1) Cargar una sola vez al iniciar la app.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setFavorites(JSON.parse(raw));
      } catch (e) {
        console.warn('No se pudieron cargar los favoritos', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // 2) Persistir cada vez que cambian (recién después de la carga inicial).
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch((e) =>
      console.warn('No se pudieron guardar los favoritos', e),
    );
  }, [favorites, ready]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, ready }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites() debe usarse dentro de <FavoritesProvider>');
  }
  return ctx;
}