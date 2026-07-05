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

    //le dice a react query cual es la pag siguiente
    //si ya estamos en la ultima pagina devuelve undefined
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.page >= lastPage.page_count;
      return isLastPage ? undefined : lastPage.page + 1;
    },
  });
}