// hooks/useProductos.ts
// Trae productos de una categoría y los pasa por el transformer.

import { searchProductsByCategory } from '@/services/productos.service';
import { useQuery } from '@tanstack/react-query';
import { getProductByCode } from '../services/producto.service';
import { transformProductDetail } from '../transformers/product-detail.transformer';
import { transformSearchProductsResponse } from '../transformers/search-products.transformer';




export function useProductosByCategory(categoria: string) {
  return useQuery({
    queryKey: ['products', categoria],
    staleTime: 1000 * 60 * 5, // 5 minutos
    // No dispara el fetch si todavía no hay categoría.
    enabled: categoria.trim().length > 0,
    queryFn: async () => {
      const response = await searchProductsByCategory(categoria);
      return transformSearchProductsResponse(response);
    },
  });
}



export function useProductByCode(code : string) {
  return useQuery({
    queryKey: ['code', code],
    staleTime: 1000 * 60 * 5, // 5 minutos
    // No dispara el fetch si todavía no hay categoría.
    enabled: code.trim().length > 0,
    queryFn: async () => {
      const response = await getProductByCode(code);
      return transformProductDetail(response);
    },
  });
}