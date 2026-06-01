import { useQuery } from '@tanstack/react-query';
import { getLabels } from '../services/labelsService';
 
export function useEtiquetas(query: string = '') {
  return useQuery({
    queryKey: ['labels', query],
    queryFn: () => getLabels(query),
    staleTime: 1000 * 60 * 5,
  });
}
 