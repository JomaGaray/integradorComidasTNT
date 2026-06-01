
import { useQuery } from '@tanstack/react-query';

import { getAllCategories } from '../services/categoriesService';

export function useCategorias(query: string = '') {
  
  return useQuery({
    queryKey: ['categories', query],
    queryFn: () => getAllCategories(query),
    staleTime: 1000 * 60 * 5,
  });
}