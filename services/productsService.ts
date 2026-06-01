import { ProductSearchResponse } from "@/types/product";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;


// los 3 tipos de busqueda soportada
export type SearchType = 'category' | 'label' | 'brand';
 
// cada tipo se traduce al parametro de busqueda que quiero
const PARAM_BY_TYPE: Record<SearchType, string> = {
  category: 'categories_tags',
  label: 'labels_tags',
  brand: 'brands_tags',
};

// declaro los campos que quiero de respuesta
const FIELDS = [
  'code',
  'product_name',
  'brands',
  'image_front_small_url',
  'nutriscore_grade',
  'ecoscore_grade',
].join(',');


function assertBaseUrl() {
  if (!BASE_URL) {
    throw new Error('Falta EXPO_PUBLIC_API_URL. Revisá .env y reiniciá con: npx expo start -c');
  }
}


export async function searchProducts(type: SearchType, value: string,): Promise<ProductSearchResponse> {
  
  assertBaseUrl();


  const params = new URLSearchParams({
          [PARAM_BY_TYPE[type]]: value, // categories_tags / labels_tags / brands_tags
          tagtype: "foods",
          lc: "es",
          limit: "20",
          fields:FIELDS
  })

  return fetchWithParams(params);
}



export async function searchProductsByText(term: string): Promise<ProductSearchResponse> {
  
  assertBaseUrl();

  const params = new URLSearchParams({
    search_terms: term,
    fields: FIELDS,
    page_size: '24',
  });

  return fetchWithParams(params);
}


// trae varios productos por sus códigos en UNA sola request, para favoritos
export async function getProductsByCodes(codes: string[]): Promise<ProductSearchResponse> {
  
  assertBaseUrl();

  const params = new URLSearchParams({
    code: codes.join(','), // bulk: cod1,cod2,cod3
    fields: FIELDS,
    page_size: String(Math.max(codes.length, 1)),
  });
  
  return fetchWithParams(params);
}


// helper comun para hacer el fetch con los parametros que le paso
async function fetchWithParams(params: URLSearchParams): Promise<ProductSearchResponse> {

  const response = await fetch(`${BASE_URL}/v2/search?${params.toString()}`, {
    headers: { 'User-Agent': 'DigitalEpicurean/1.0 (Expo app - UNTDF TNT 2026)' },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al buscar productos`);
  }

  return (await response.json()) as ProductSearchResponse;
}
 