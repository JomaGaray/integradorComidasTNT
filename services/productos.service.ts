import { ProductSearchResponse } from "@/types/product";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// declaramos lo que queremos
const FIELDS = [
  'code',
  'product_name',
  'brands',
  'image_front_small_url',
  'nutriscore_grade',
  'ecoscore_grade',
].join(',');

export async function searchProductsByCategory(categoria: string): Promise<ProductSearchResponse> {
  if (!BASE_URL) {
    throw new Error('Falta EXPO_PUBLIC_API_URL. Revisá .env y reiniciá con: npx expo start -c');
  }

  const url = `${BASE_URL}/v2/search`;
  const params = new URLSearchParams({
          categories_tags_es: categoria,
          tagtype: "foods",
          lc: "es",
          limit: "20",
          fields:FIELDS
  })

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: { 'User-Agent': 'DigitalEpicurean/1.0 (Expo app - UNTDF TNT 2026)' },
  });

  console.debug("Called from Productos Service: ", `${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al buscar productos`);
  }

  return (await response.json()) as ProductSearchResponse;
}