import { useQuery } from '@tanstack/react-query';

import { searchProductsByText } from '../services/productsService';
import { transformSearchProductsResponse } from '../transformers/search-products';

//busqueda por texto
export function useBusqueda(term: string) {
  return useQuery({
    queryKey: ['busqueda', term],
    enabled: term.trim().length > 1,
    staleTime: 1000 * 60,
    queryFn: async () => {
      const response = await searchProductsByText(term);
      return transformSearchProductsResponse(response);
    },
  });
}