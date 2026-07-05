import { useInfiniteQuery } from '@tanstack/react-query';

import { searchProductsByText } from '../services/productsService';
import { transformSearchProductsResponse } from '../transformers/search-products';

export function useSearchInfinite(term: string) {
  return useInfiniteQuery({
    queryKey: ['busqueda-infinite', term],
    enabled: term.trim().length > 1,
    staleTime: 1000 * 60,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await searchProductsByText(term, pageParam);
      return transformSearchProductsResponse(response);
    },
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.page >= lastPage.page_count;
      return isLastPage ? undefined : lastPage.page + 1;
    },
  });
}