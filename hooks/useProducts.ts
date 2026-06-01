import { useQuery } from '@tanstack/react-query';
import { getProductByCode } from '../services/productService';
import { SearchType, searchProducts } from '../services/productsService';
import { transformProductDetail } from '../transformers/product-detail';
import { transformSearchProductsResponse } from '../transformers/search-products';



//busqueda generica: por categoría, etiqueta o marca
export function useProductos(type: SearchType, value: string) {
  return useQuery({
    queryKey: ['products', type, value],
    staleTime: 1000 * 60 * 5,
    enabled: value.trim().length > 0,
    
    queryFn: async () => {
      const response = await searchProducts(type, value);
      return transformSearchProductsResponse(response);
    },
  });
}


export function useProductosByCategory(categoria: string) {
  return useProductos('category', categoria);
}



export function useProductByCode(code : string) {
  return useQuery({
    queryKey: ['code', code],
    staleTime: 1000 * 60 * 5,
    enabled: code.trim().length > 0,
    queryFn: async () => {
      const response = await getProductByCode(code);
      return transformProductDetail(response);
    },
  });
}