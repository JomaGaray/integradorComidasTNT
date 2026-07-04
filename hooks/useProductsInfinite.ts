import { useInfiniteQuery } from '@tanstack/react-query';

import { SearchType, searchProducts } from '../services/productsService';
import { transformSearchProductsResponse } from '../transformers/search-products';

export function useProductsInfinite(type: SearchType, value: string) {
  return useInfiniteQuery({
    queryKey: ['products-infinite', type, value],
    enabled: value.trim().length > 0,
    staleTime: 1000 * 60 * 5,

    
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const response = await searchProducts(type, value, pageParam);
      return transformSearchProductsResponse(response);
    },

    // Le dice a React Query cuál es "la página siguiente".
    // Si ya estamos en la última página (page_count), devolvemos undefined:
    // eso es la señal de "no hay más" (hasNextPage pasa a false).
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.page >= lastPage.page_count;
      return isLastPage ? undefined : lastPage.page + 1;
    },
  });
}