// app/_layout.tsx
// Layout raíz. Acá viven los providers globales:
//  - SafeAreaProvider: para los insets (notch, barra de estado)
//  - QueryClientProvider: React Query (caché de las llamadas a la API)
//  - FavoritesProvider: estado de favoritos con AsyncStorage

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FavoritesProvider } from '../context/FavoritesContext';

// Una sola instancia para toda la app.
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          {/* Cada pantalla arma su propio header, por eso lo ocultamos acá */}
          <Stack screenOptions={{ headerShown: false }} />
        </FavoritesProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}