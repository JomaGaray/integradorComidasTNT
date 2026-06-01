import { ProductSearchResponse } from '../types/product';

export type MyProduct = {
  id: string;
  name: string;
  brand: string;
  imageUrl?: string;
  nutriScore?: string;
  ecoScore?: string;
};

export type MyProductSearchResponse = {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: MyProduct[];
};


function formatGrade(grade?: string): string | undefined {
  if (!grade) return undefined;
  const g = grade.toLowerCase();
  if (g === 'unknown' || g === 'not-applicable') return undefined;
  return g.replace('-plus', '+').toUpperCase();
}

export function transformSearchProductsResponse(
  response: ProductSearchResponse,
): MyProductSearchResponse {
  return {
    count: response.count,
    page: response.page,
    page_count: response.page_count,
    page_size: response.page_size,
    products: (response.products ?? [])
      .filter((p) => p.product_name && p.product_name.trim().length > 0)
      .map((p) => ({
        id: p.code ?? '',
        name: p.product_name!.trim(),
        brand: (p.brands?.split(',')[0] ?? '').trim(),
        imageUrl:  p.image_front_small_url,
        nutriScore: formatGrade(p.nutriscore_grade),
        ecoScore: formatGrade(p.ecoscore_grade),
      })),
  };
}