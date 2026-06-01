import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useFavorites } from '../context/FavoritesContext';
import { getProductsByCodes } from '../services/productsService';
import { transformSearchProductsResponse } from '../transformers/search-products.transformer';

export function useFavoritos() {
  const { favorites } = useFavorites();
  const codes = [...favorites].sort();

  return useQuery({
    queryKey: ['favoritos', codes.join(',')],
    enabled: codes.length > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await getProductsByCodes(codes);
      return transformSearchProductsResponse(response);
    },
  });
}