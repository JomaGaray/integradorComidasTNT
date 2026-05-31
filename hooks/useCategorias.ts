// hooks/useCategorias.ts
// Hook que envuelve el service con React Query: nos da loading/error/caché gratis.

import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '../services/categories';

export function useCategorias(query: string = '') {
  return useQuery({
    // La query key incluye el término: si cambia, React Query refetchea solo.
    queryKey: ['categories', query],
    queryFn: () => getAllCategories(query),
    // Las categorías casi no cambian, así que las consideramos "frescas" 5 minutos
    // (no refetchea de nuevo en ese lapso).
    staleTime: 1000 * 60 * 5,
  });
}