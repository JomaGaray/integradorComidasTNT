// hooks/useBusqueda.ts
// Búsqueda de productos por texto libre (tab Search).

import { useQuery } from '@tanstack/react-query';

import { searchProductsByText } from '../services/productsService';
import { transformSearchProductsResponse } from '../transformers/search-products.transformer';

export function useBusqueda(term: string) {
  return useQuery({
    queryKey: ['busqueda', term],
    // No buscamos hasta tener al menos 2 caracteres.
    enabled: term.trim().length > 1,
    staleTime: 1000 * 60,
    queryFn: async () => {
      const response = await searchProductsByText(term);
      return transformSearchProductsResponse(response);
    },
  });
}